"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageMessageController = exports.textMessageController = void 0;
const chat_model_1 = require("../models/chat.model");
const responseHandler_1 = require("../utils/responseHandler");
const openAI_1 = require("../config/openAI");
const user_model_1 = require("../models/user.model");
const imagekit_1 = __importDefault(require("../config/imagekit"));
const axios_1 = __importDefault(require("axios"));
const promptValidator_1 = require("../utils/promptValidator");
const devGptPrompt_1 = require("../utils/devGptPrompt");
// Text-based AI chat Message controller
const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return (0, responseHandler_1.response)(res, 400, "You don't have enough credits to use this feature");
        }
        const { chatId, prompt } = req.body;
        const chat = await chat_model_1.Chat.findOne({ userId, _id: chatId });
        chat?.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });
        // AI response with development-focused system prompt
        const { choices } = await openAI_1.openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: devGptPrompt_1.SYSTEM_PROMPTS.TEXT_CHAT },
                { role: "user", content: prompt },
            ],
        });
        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false
        };
        (0, responseHandler_1.response)(res, 200, "Response generated successfully", reply);
        chat?.messages.push(reply);
        await chat?.save();
        await user_model_1.User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
};
exports.textMessageController = textMessageController;
// Image Generation message controller
const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return (0, responseHandler_1.response)(res, 400, "You don't have enough credits to use this feature");
        }
        const { prompt, chatId, isPublished } = req.body;
        // Validate if prompt is development-related
        const validation = await (0, promptValidator_1.validateDevPrompt)(prompt, 'image');
        if (!validation.valid) {
            return (0, responseHandler_1.response)(res, 400, validation.message || "Only development-related image generation is allowed");
        }
        // Find chat
        const chat = await chat_model_1.Chat.findOne({ userId, _id: chatId });
        // Push user message
        chat?.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });
        // Use enhanced prompt if available, otherwise use original
        const finalPrompt = validation.enhancedPrompt || prompt;
        const encodedPrompt = encodeURIComponent(finalPrompt);
        // Construct imagekit AI generation URL
        const generatedImageURL = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/devGPT/${Date.now()}.png?.tr=w-800,h-800`;
        // Generation by fetching from imagekit
        const aiImageResponse = await axios_1.default.get(generatedImageURL, {
            responseType: 'arraybuffer'
        });
        // convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;
        // upload to imagekit media library
        const uploadResponse = await imagekit_1.default.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "devGPT",
        });
        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };
        (0, responseHandler_1.response)(res, 200, "Response generated successfully", reply);
        chat?.messages.push(reply);
        await chat?.save();
        await user_model_1.User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
};
exports.imageMessageController = imageMessageController;
