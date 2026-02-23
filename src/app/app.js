const { ManagedIdentityCredential } = require("@azure/identity");
const { App } = require("@microsoft/teams.apps");
const { LocalStorage } = require("@microsoft/teams.common");
const { MessageActivity } = require("@microsoft/teams.api");
const config = require("../config");

// Import AI engine
const { askAI } = require("../ai/askAI.js");

// Create storage (reserved for future conversation memory if needed)
const storage = new LocalStorage();

/* ============================
   AUTH SETUP
============================ */

const createTokenFactory = () => {
  return async (scope, tenantId) => {
    const managedIdentityCredential = new ManagedIdentityCredential({
      clientId: process.env.CLIENT_ID
    });

    const scopes = Array.isArray(scope) ? scope : [scope];

    const tokenResponse = await managedIdentityCredential.getToken(scopes, {
      tenantId: tenantId
    });

    return tokenResponse.token;
  };
};

const tokenCredentials = {
  clientId: process.env.CLIENT_ID || "",
  token: createTokenFactory()
};

const credentialOptions =
  config.MicrosoftAppType === "UserAssignedMsi"
    ? { ...tokenCredentials }
    : undefined;

// Create Teams app
const app = new App({
  ...credentialOptions,
  storage
});

/* ============================
   MESSAGE HANDLER
============================ */

app.on("message", async ({ send, activity }) => {
  try {
    // 🔒 Restrict to Personal Chat Only (safe rollout)
    if (activity.conversation?.conversationType !== "personal") {
      return;
    }

    const userMessage = activity.text?.trim();

    if (!userMessage) {
      await send("Please enter a valid question.");
      return;
    }

    // Structured logging
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: "IncomingMessage",
      user: activity.from?.name,
      userId: activity.from?.id,
      conversationType: activity.conversation?.conversationType,
      message: userMessage
    }));

    // Call AI engine
    const aiResponse = await askAI(userMessage);

    // Wrap response with AI indicator + feedback
    const responseActivity = new MessageActivity(aiResponse)
      .addAiGenerated()
      .addFeedback();

    await send(responseActivity);

  } catch (error) {
    // Structured error logging
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: "AIError",
      error: error.message,
      stack: error.stack
    }));

    await send(
      "The Staff AI Assistant is temporarily unavailable. Please try again or contact IT support if the issue persists."
    );
  }
});

/* ============================
   FEEDBACK HANDLER
============================ */

app.on("message.submit.feedback", async ({ activity }) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: "FeedbackReceived",
    user: activity.from?.name,
    userId: activity.from?.id,
    feedback: activity.value
  }));
});

/* ============================
   EXPORT
============================ */

module.exports = app;