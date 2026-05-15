import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import prisma from "./prisma";
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
    const email = resumeText.match(emailRegex);
    if (email === null) {
      return res.status(400).json({ error: "No email found in resume" });
    }
    let user = await prisma.user.findUnique({ where: { email } });
    if (user === null) {
      user = await prisma.user.create({ data: { email } });
    }
    const jobTitle = req.body.jobTitle;
    const salaryExpectation = req.body.salaryExpectation;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Pretend you're a recruiter for a certain company, someone's applying for ${jobTitle} position, expects a salaryExpectation of ${salaryExpectation} USD and their details are ${resumeText} in resume form. Give summary of their submission and then constructive feedback. Respond in pure JSON only, no markdown, no backticks, with exactly these keys: {"summary": "...", "feedback": "..."}. Use witty humor and don't forget to roast or praise them when necessary.`,
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
    res.json(submission);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/history", (req, res) => {});

app.listen(3000, () => {
  console.log(`listening on port ${port}`);
});
