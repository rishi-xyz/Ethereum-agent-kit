import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/config";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

/**
 * Process a user query with Gemini AI
 */
export async function processQuery(messages: string[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const query = await model.generateContent(messages);
    return query?.response;
}