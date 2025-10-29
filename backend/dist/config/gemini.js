"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gemini = void 0;
// config/gemini.ts
const google_genai_1 = require("@langchain/google-genai");
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
exports.gemini = new google_genai_1.ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    maxOutputTokens: 1024,
    apiKey: GOOGLE_API_KEY,
});
