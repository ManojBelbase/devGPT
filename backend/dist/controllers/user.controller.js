import { response } from "../utils/responseHandler";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { Chat } from "../models/chat.model";
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1️⃣ Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return response(res, 400, "User already exists");
        }
        // 2️⃣ Create new user
        const user = await User.create({ name, email, password });
        // 3️⃣ Generate token
        const token = generateToken(String(user._id));
        // 4️⃣ Return success response
        return response(res, 201, "User created successfully", {
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
        return response(res, 500, "Internal server error");
    }
};
// API to login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1️⃣ Find user
        const user = await User.findOne({ email });
        if (!user)
            return response(res, 404, "User not found");
        // 2️⃣ Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return response(res, 401, "Invalid credentials");
        // 3️⃣ Generate token
        const token = generateToken(String(user._id));
        // 4️⃣ Send cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        // 5️⃣ Send response
        return response(res, 200, "User login successfully", {
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
        return response(res, 500, "Internal server error");
    }
};
// API to get data
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return response(res, 200, user);
    }
    catch (error) {
        return response(res, 500, "Internal server error");
    }
};
// API to logout 
export const logoutUser = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return response(res, 200, "Logged out successfully");
};
// API to get published images
export const publishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
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
        response(res, 200, "Images fetch successfully", { images: publishedImageMessages.reverse() });
    }
    catch (error) {
    }
};
