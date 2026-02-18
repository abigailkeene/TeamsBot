import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { askAI } from "./ai/askAI.js";
import { BotFrameworkAdapter } from "botbuilder";
import { StaffAIBot } from "./bot.js";

dotenv.config();

const app = express();

// Enable CORS for GitHub Pages frontend
app.use(cors({
  origin: "https://abigailkeene.github.io"
}));

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.send("SERVER IS ALIVE");
});

/* =========================
   EXISTING WEBSITE ENDPOINT
   (UNCHANGED)
========================= */
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  console.log("📩 Question received:", question);

  try {
    const answer = await askAI(question);
    res.json({ answer });
  } catch (error) {
    console.error("❌ AI error:", error.message);
    res.status(500).json({ error: "Internal AI error" });
  }
});

/* =========================
   MICROSOFT TEAMS BOT
   (NEW — DOES NOT AFFECT /ask)
========================= */

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new StaffAIBot();

app.post("/api/messages", async (req, res) => {
  await adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});

/* =========================
   SERVER START
========================= */

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`🚀 Staff AI API running on port ${port}`);
});
