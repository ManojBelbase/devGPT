"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishedImages = exports.logoutUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const user_model_1 = require("../models/user.model");
const generateToken_1 = require("../utils/generateToken");
const chat_model_1 = require("../models/chat.model");
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1️⃣ Check if user already exists
        const userExist = await user_model_1.User.findOne({ email });
        if (userExist) {
            return (0, responseHandler_1.response)(res, 400, "User already exists");
        }
        // 2️⃣ Create new user
        const user = await user_model_1.User.create({ name, email, password });
        // 3️⃣ Generate token
        const token = (0, generateToken_1.generateToken)(String(user._id));
        // 4️⃣ Return success response
        return (0, responseHandler_1.response)(res, 201, "User created successfully", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                credits: user.credits,
            },
            token,
        });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.registerUser = registerUser;
// API to login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1️⃣ Find user
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return (0, responseHandler_1.response)(res, 404, "User not found");
        // 2️⃣ Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return (0, responseHandler_1.response)(res, 401, "Invalid credentials");
        // 3️⃣ Generate token
        const token = (0, generateToken_1.generateToken)(String(user._id));
        // 4️⃣ Send cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        // 5️⃣ Send response
        return (0, responseHandler_1.response)(res, 200, "User login successfully", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                credits: user.credits,
            },
        });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.loginUser = loginUser;
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
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return (0, responseHandler_1.response)(res, 200, "Logged out successfully");
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
