import { createChat, deleteChat, getAllChats } from '../controllers/chat.controller';
import { authMiddleware } from './../middlewares/auth';
import express from 'express';
const chatRouter = express.Router();
chatRouter.post("/create", authMiddleware, createChat);
chatRouter.get("/", authMiddleware, getAllChats);
chatRouter.delete('/delete', authMiddleware, deleteChat);
export default chatRouter;
