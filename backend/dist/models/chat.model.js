"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userId: { type: String, ref: "User", required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    messages: [{
            isImage: { type: Boolean, required: true },
            isPublished: { type: Boolean, default: false },
            role: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Number, required: true }
        }]
}, { timestamps: true });
exports.Chat = mongoose_1.default.model("Chat", chatSchema);
