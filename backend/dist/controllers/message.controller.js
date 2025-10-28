import { Chat } from "../models/chat.model";
import { response } from "../utils/responseHandler";
import { openai } from "../config/openAI";
import { User } from '../models/user.model';
import imagekit from '../config/imagekit';
import axios from 'axios';
import { validateDevPrompt } from "../utils/promptValidator";
import { SYSTEM_PROMPTS } from "../utils/devGptPrompt";
// Text-based AI chat Message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return response(res, 400, "You don't have enough credits to use this feature");
        }
        const { chatId, prompt } = req.body;
        const chat = await Chat.findOne({ userId, _id: chatId });
        chat?.messages.push({
            role: "User",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });
        // AI response with development-focused system prompt
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: SYSTEM_PROMPTS.TEXT_CHAT },
                { role: "user", content: prompt },
            ],
        });
        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false
        };
        response(res, 200, "Response generated successfully", reply);
        chat?.messages.push(reply);
        await chat?.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
    }
    catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};
// Image Generation message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return response(res, 400, "You don't have enough credits to use this feature");
        }
        const { prompt, chatId, isPublished } = req.body;
        // Validate if prompt is development-related
        const validation = await validateDevPrompt(prompt, 'image');
        if (!validation.valid) {
            return response(res, 400, validation.message || "Only development-related image generation is allowed");
        }
        // Find chat
        const chat = await Chat.findOne({ userId, _id: chatId });
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
        const aiImageResponse = await axios.get(generatedImageURL, {
            responseType: 'arraybuffer'
        });
        // convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;
        // upload to imagekit media library
        const uploadResponse = await imagekit.upload({
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
        response(res, 200, "Response generated successfully", reply);
        chat?.messages.push(reply);
        await chat?.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    }
    catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};
