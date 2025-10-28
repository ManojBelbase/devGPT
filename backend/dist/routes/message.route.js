import { imageMessageController, textMessageController } from '../controllers/message.controller';
import { authMiddleware } from './../middlewares/auth';
import express from 'express';
const messageRouter = express.Router();
messageRouter.post('/text', authMiddleware, textMessageController);
messageRouter.post('/image', authMiddleware, imageMessageController);
export default messageRouter;
