"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const responseHandler_1 = require("../utils/responseHandler");
const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Get token from cookies
        const token = req.cookies?.authToken;
        if (!token || !process.env.JWT_SECRET) {
            return (0, responseHandler_1.response)(res, 401, "Authorization token or JWT secret missing");
        }
        // ✅ Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ Find user by ID
        const user = await user_model_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return (0, responseHandler_1.response)(res, 403, "Not authorized, user not found");
        }
        // ✅ Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return (0, responseHandler_1.response)(res, 401, "Invalid or expired token");
    }
};
exports.authMiddleware = authMiddleware;
