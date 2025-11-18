"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishedImages = exports.logoutUser = exports.getUser = exports.refreshTokenController = exports.loginUser = exports.registerUser = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const user_model_1 = require("../models/user.model");
const chat_model_1 = require("../models/chat.model");
const token_service_1 = require("../services/token.service");
const sendCookies_1 = require("../utils/sendCookies");
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exist = await user_model_1.User.findOne({ email });
        if (exist)
            return (0, responseHandler_1.response)(res, 400, "User already exists");
        const user = await user_model_1.User.create({ name, email, password });
        const accessToken = (0, token_service_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, token_service_1.generateRefreshToken)(user._id.toString());
        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        (0, sendCookies_1.sendAuthCookies)(res, accessToken, refreshToken, isLocalhost);
        return (0, responseHandler_1.response)(res, 201, "User registered successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        });
    }
    catch (err) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.registerUser = registerUser;
// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return (0, responseHandler_1.response)(res, 404, "User not found");
        const match = await user.comparePassword(password);
        if (!match)
            return (0, responseHandler_1.response)(res, 401, "Invalid credentials");
        const accessToken = (0, token_service_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, token_service_1.generateRefreshToken)(user._id.toString());
        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        (0, sendCookies_1.sendAuthCookies)(res, accessToken, refreshToken, isLocalhost);
        return (0, responseHandler_1.response)(res, 200, "Login successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        });
    }
    catch {
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.loginUser = loginUser;
const refreshTokenController = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return (0, responseHandler_1.response)(res, 401, "No refresh token provided");
        }
        // Verify the old refresh token
        const decoded = (0, token_service_1.verifyRefreshToken)(oldRefreshToken);
        const user = await user_model_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return (0, responseHandler_1.response)(res, 401, "Invalid refresh token");
        }
        const newAccessToken = (0, token_service_1.generateAccessToken)(user._id.toString());
        const newRefreshToken = (0, token_service_1.generateRefreshToken)(user._id.toString());
        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        (0, sendCookies_1.sendAuthCookies)(res, newAccessToken, newRefreshToken, isLocalhost);
        return (0, responseHandler_1.response)(res, 200, "Token refreshed successfully");
    }
    catch (err) {
        // Optional: clear cookies on invalid token
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
        return (0, responseHandler_1.response)(res, 401, "Invalid or expired refresh token");
    }
};
exports.refreshTokenController = refreshTokenController;
// API to get data
const getUser = async (req, res) => {
    try {
        const user = req.user;
        return (0, responseHandler_1.response)(res, 200, "User fetch successfully", user);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.getUser = getUser;
// API to logout
const logoutUser = (req, res) => {
    const isLocalhost = req.headers.origin?.includes("localhost");
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: !isLocalhost,
        sameSite: isLocalhost ? "lax" : "none",
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: !isLocalhost,
        sameSite: isLocalhost ? "lax" : "none",
        path: "/",
    });
    (0, responseHandler_1.response)(res, 200, "Logged out successfully");
};
exports.logoutUser = logoutUser;
// API to get published images
const publishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await chat_model_1.Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ]);
        (0, responseHandler_1.response)(res, 200, "Images fetch successfully", { images: publishedImageMessages.reverse() });
    }
    catch (error) {
    }
};
exports.publishedImages = publishedImages;
