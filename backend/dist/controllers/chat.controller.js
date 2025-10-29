"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.getAllChats = exports.createChat = void 0;
const chat_model_1 = require("../models/chat.model");
const responseHandler_1 = require("../utils/responseHandler");
const createChat = async (req, res) => {
    try {
        const userId = req?.user?._id;
        const chatData = {
            userId,
            messages: [],
            title: "New Chat",
            userName: req.user.name
        };
        await chat_model_1.Chat.create(chatData);
        return (0, responseHandler_1.response)(res, 201, "Chat created successfully", chatData);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
};
exports.createChat = createChat;
// API Controller for getting all chats
const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await chat_model_1.Chat.find({ userId }).sort({ updatedAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Chats Fetch successfully", chats);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
};
exports.getAllChats = getAllChats;
// API Controller for deleting a chat
const deleteChat = async (req, res) => {
    const userId = req.user?._id;
    const { chatId } = req?.body;
    if (!chatId) {
        return (0, responseHandler_1.response)(res, 400, "chatId is required");
    }
    const result = await chat_model_1.Chat.deleteOne({ _id: chatId, userId });
    if (result.deletedCount === 0) {
        return (0, responseHandler_1.response)(res, 404, "Chat not found or already deleted");
    }
    return (0, responseHandler_1.response)(res, 200, "Chat deleted successfully");
};
exports.deleteChat = deleteChat;
