import { ActivityHandler } from "botbuilder";
import { askAI } from "./ai/askAI.js";

export class StaffAIBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;

      console.log("Teams message:", userMessage);

      try {
        const answer = await askAI(userMessage);
        await context.sendActivity(answer);
      } catch (error) {
        console.error("Bot error:", error.message);
        await context.sendActivity("Sorry, I ran into an internal error.");
      }

      await next();
    });
  }
}
