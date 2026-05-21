import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import prisma from "./prisma.js";
import { GoogleGenAI } from "@google/genai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, slow down." },
});

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 3000;

// Soft auth - attaches user to req if token valid, but doesn't block unauthenticated requests.
// Routes that require auth check req.user themselves.
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch {
    next();
  }
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(authenticate);

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post(
  "/submit",
  limiter,
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err?.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ error: "File too large. Max 5MB." });
      if (err) return res.status(400).json({ error: "Upload failed." });
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No file uploaded." });

      if (req.file.mimetype !== "application/pdf")
        return res.status(400).json({ error: "PDF files only." });

      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      await parser.destroy();
      const resumeText = result.text;
      const jobTitle = req.body.jobTitle?.trim();
      const salaryExpectation = req.body.salaryExpectation;

      if (!jobTitle || jobTitle.length > 100)
        return res.status(400).json({ error: "Invalid job title." });

      if (
        !salaryExpectation ||
        isNaN(Number(salaryExpectation)) ||
        Number(salaryExpectation) <= 0
      )
        return res.status(400).json({ error: "Invalid salary." });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Pretend you're a recruiter for a certain company, someone's applying for ${jobTitle} position, expects a salary of ${salaryExpectation} USD yearly and their details are ${resumeText} in resume form. Give summary of their submission and then constructive feedback. Respond in pure JSON only, no markdown, no backticks, with exactly these keys: {"summary": "...", "feedback": "..."}. Do not use markdown formatting in your response text. Use witty humor and don't forget to roast or praise them when necessary but keep your response concise and punchy.`,
      });
      const responseText = response.text;
      let summary, feedback;
      try {
        ({ summary, feedback } = JSON.parse(responseText));
      } catch {
        return res.status(500).json({
          error: "AI returned an unexpected response. Please try again.",
        });
      }
      if (req.user) {
        const submission = await prisma.submission.create({
          data: {
            summary,
            feedback,
            jobTitle,
            salaryExpectation,
            userID: req.user.userId,
          },
          include: { user: true },
        });
        res.json({ ...submission, email: submission.user.email });
      } else {
        res.json({
          summary,
          feedback,
          jobTitle,
          salaryExpectation,
        });
      }
    } catch (error) {
      if (error.status === 503) {
        return res.status(503).json({
          error: "The AI is currently busy. Please try again in a moment.",
        });
      }
      return res.status(500).json({ error: "Something went wrong." });
    }
  },
);

app.get("/submission/:id", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized." });
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
    res.json({ message: "Registered successfully", token });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already registered." });
    }
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
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const hash = user.password;
    const match = await bcrypt.compare(password, hash);
    if (match) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ message: "Registered successfully", token });
    } else {
      return res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully." });
});

app.get("/me", async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Invalid credentials." });
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ userId: user.id, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(3000, () => {
  console.log(`listening on port ${port}`);
});
