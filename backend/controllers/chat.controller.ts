
import { Request, Response } from "express"
import { Chat } from "../models/chat.model"
import { response } from "../utils/responseHandler"

export const createChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any)?.user?._id

        const chatData = {
            userId,
            messages: [],
            title: "New Chat",
            userName: (req as any).user.name
        }
        await Chat.create(chatData)
        return response(res, 201, "Chat created successfully", chatData)
    } catch (error: any) {
        return response(res, 500, "Internal server error", error.message);
    }
}

// API Controller for getting all chats
export const getAllChats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })

        return response(res, 200, "Chats Fetch successfully", chats)
    } catch (error: any) {
        return response(res, 500, "Internal server error", error.message);
    }
}

// API Controller for deleting a chat
export const deleteChat = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { chatId } = req?.body;

    if (!chatId) {
        return response(res, 400, "chatId is required");
    }

    const result = await Chat.deleteOne({ _id: chatId, userId });

    if (result.deletedCount === 0) {
        return response(res, 404, "Chat not found or already deleted");
    }

    return response(res, 200, "Chat deleted successfully");
};



