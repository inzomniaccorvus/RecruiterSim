import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import prisma from "./prisma.js";
import { GoogleGenAI } from "@google/genai";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { error } from "console";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();
const port = 3000;

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    next();
  }
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(authenticate);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/submit", upload.single("resume"), async (req, res) => {
  try {
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    await parser.destroy();
    const resumeText = result.text;
    const jobTitle = req.body.jobTitle;
    const salaryExpectation = req.body.salaryExpectation;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Pretend you're a recruiter for a certain company, someone's applying for ${jobTitle} position, expects a salaryExpectation of ${salaryExpectation} USD yearly and their details are ${resumeText} in resume form. Give summary of their submission and then constructive feedback. Respond in pure JSON only, no markdown, no backticks, with exactly these keys: {"summary": "...", "feedback": "..."}. Do not use markdown formatting in your response text. Use witty humor and don't forget to roast or praise them when necessary.`,
    });
    const responseText = response.text;
    const { summary, feedback } = JSON.parse(responseText);
    if (req.user) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });
      const submission = await prisma.submission.create({
        data: {
          summary,
          feedback,
          jobTitle,
          salaryExpectation,
          userID: user.id,
        },
      });
      res.json({ ...submission, email: user.email });
    } else {
      res.json({
        summary,
        feedback,
        jobTitle,
        salaryExpectation,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/submission/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { user: true },
    });
    if (submission === null) {
      return res.status(404).json({ error: "entry missing." });
    }
    res.json({ ...submission, email: submission.user.email });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/history", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const submissions = await prisma.submission.findMany({
      where: { userID: req.user.userId },
    });
    res.json(submissions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true when https is available ig
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user === null) {
      return res.status(404).json({ error: "entry missing." });
    }
    const hash = user.password;
    const match = await bcrypt.compare(password, hash);
    if (match) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // set true when https is available ig
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ message: "Logged in successfully" });
    }
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logged out successfully.",
  });
});

app.listen(3000, () => {
  console.log(`listening on port ${port}`);
});
