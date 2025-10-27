
// Text-based AI chat Message controller
import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { response } from "../utils/responseHandler";
import { openai } from "../config/openAI";
import { User } from '../models/user.model'

export const textMessageController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat?.messages.push({ role: "User", content: prompt, timestamp: Date.now(), isImage: false })

        // AI response
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        response(res, 200, "Response generated successfully", response)

        chat?.messages.push(reply)
        await chat?.save()

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

    } catch (error: any) {
        return response(res, 500, "Internal server error", error.message);
    }
}

// Image Generation message controller

export const imageMessageController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        if ((req as any).user.credits < 1) {
            return response(res, 400, "You don't have enough credits to use this feature")
        }

        const { prompt, chatId, isPublished } = req.body
        // Find chat
        const chat = await Chat.findOne({ userId, _id: chatId })

        // Push user message
        chat?.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

    } catch (error) {

    }
}