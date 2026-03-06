import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { askAI } from "./src/src/askAI.js";
import { StaffAIBot } from "./bot.js";
import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  ConfigurationBotFrameworkAuthentication
} from "botbuilder";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */
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
========================= */

const credentialsFactory =
  new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MICROSOFT_APP_ID,
    MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
    MicrosoftAppType: "SingleTenant",
    MicrosoftAppTenantId: process.env.MICROSOFT_APP_TENANT_ID
  });

const botFrameworkAuthentication =
  new ConfigurationBotFrameworkAuthentication({}, credentialsFactory);

const adapter = new CloudAdapter(botFrameworkAuthentication);

// Global error handler
adapter.onTurnError = async (context, error) => {
  console.error("🔥 UNHANDLED BOT ERROR:", error);
  await context.sendActivity("The bot encountered an internal error.");
};

const bot = new StaffAIBot();

app.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => {
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