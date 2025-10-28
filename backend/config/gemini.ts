// config/gemini.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY

export const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    maxOutputTokens: 1024,
    apiKey: GOOGLE_API_KEY,
});