import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import prisma from "./prisma.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/submit", upload.single("resume"), async (req, res) => {
  try {
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    await parser.destroy();
    const resumeText = result.text;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const emailMatch = resumeText.match(emailRegex);
    if (emailMatch === null) {
      return res.status(400).json({ error: "No email found in resume" });
    }
    const email = emailMatch[0];
    let user = await prisma.user.findUnique({ where: { email } });
    if (user === null) {
      user = await prisma.user.create({ data: { email } });
    }
    const jobTitle = req.body.jobTitle;
    const salaryExpectation = req.body.salaryExpectation;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Pretend you're a recruiter for a certain company, someone's applying for ${jobTitle} position, expects a salaryExpectation of ${salaryExpectation} USD yearly and their details are ${resumeText} in resume form. Give summary of their submission and then constructive feedback. Respond in pure JSON only, no markdown, no backticks, with exactly these keys: {"summary": "...", "feedback": "..."}. Do not use markdown formatting in your response text. Use witty humor and don't forget to roast or praise them when necessary.`,
    });
    const responseText = response.text;
    const { summary, feedback } = JSON.parse(responseText);
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
    const email = req.query.email;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user === null) {
      return res.status(404).json({ error: "entry missing." });
    }
    const submissions = await prisma.submission.findMany({
      where: { userID: user.id },
    });
    res.json(submissions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => {
  console.log(`listening on port ${port}`);
});
