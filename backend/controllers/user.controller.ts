import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { Chat } from "../models/chat.model";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
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
    } catch (error) {
        console.error("Error in registerUser:", error);
        return response(res, 500, "Internal server error");
    }
};


// API to login user

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        // 1️⃣ Find user
        const user = await User.findOne({ email });
        if (!user) return response(res, 404, "User not found");

        // 2️⃣ Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return response(res, 401, "Invalid credentials");

        // 3️⃣ Generate token
        const token = generateToken(String(user._id));



        // 5️⃣ Send response
        const isLocalhost = req.headers.origin?.includes("localhost");
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: !isLocalhost, // Secure only if NOT localhost
            sameSite: isLocalhost ? "lax" : "none", // 'none' for cross-site HTTPS
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });


    } catch (error) {
        console.error("Error in loginUser:", error);
        return response(res, 500, "Internal server error");
    }
};

// API to get data
export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = (req as any).user;
        return response(res, 200, "User fetch successfully", user)
    } catch (error) {
        return response(res, 500, "Internal server error");

    }
}

// API to logout 
export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return response(res, 200, "Logged out successfully");
};

// API to get published images
export const publishedImages = async (req: Request, res: Response): Promise<any> => {
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

        ])
        response(res, 200, "Images fetch successfully", { images: publishedImageMessages.reverse() })
    } catch (error) {

    }
}