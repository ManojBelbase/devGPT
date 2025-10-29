"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_controller_1 = require("../controllers/message.controller");
const auth_1 = require("./../middlewares/auth");
const express_1 = __importDefault(require("express"));
const messageRouter = express_1.default.Router();
messageRouter.post('/text', auth_1.authMiddleware, message_controller_1.textMessageController);
messageRouter.post('/image', auth_1.authMiddleware, message_controller_1.imageMessageController);
exports.default = messageRouter;
