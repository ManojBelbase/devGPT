"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.User.findById(decoded.id).select("-password");
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};
exports.authMiddleware = authMiddleware;
