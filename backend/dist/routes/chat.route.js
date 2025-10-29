"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_controller_1 = require("../controllers/chat.controller");
const auth_1 = require("./../middlewares/auth");
const express_1 = __importDefault(require("express"));
const chatRouter = express_1.default.Router();
chatRouter.post("/create", auth_1.authMiddleware, chat_controller_1.createChat);
chatRouter.get("/", auth_1.authMiddleware, chat_controller_1.getAllChats);
chatRouter.delete('/delete', auth_1.authMiddleware, chat_controller_1.deleteChat);
exports.default = chatRouter;
