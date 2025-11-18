import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { User } from "../models/user.model";
import { Chat } from "../models/chat.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/token.service";
import { sendAuthCookies } from "../utils/sendCookies";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });
        if (exist) return response(res, 400, "User already exists")

        const user = await User.create({ name, email, password });

        const accessToken = generateAccessToken((user._id as any).toString());
        const refreshToken = generateRefreshToken((user._id as any).toString());

        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        sendAuthCookies(res, accessToken, refreshToken, isLocalhost);

        return response(res, 201, "User registered successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        })
    } catch (err) {
        return response(res, 500, "Internal server error");
    }
};

// API to login user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return response(res, 404, "User not found");


        const match = await user.comparePassword(password);
        if (!match)
            return response(res, 401, "Invalid credentials");

        const accessToken = generateAccessToken((user._id as any).toString());
        const refreshToken = generateRefreshToken((user._id as any).toString());

        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        sendAuthCookies(res, accessToken, refreshToken, isLocalhost);
        return response(res, 200, "Login successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
        }
        )

    } catch {
        return response(res, 500, "Internal server error");
    }
};

export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return response(res, 401, "No refresh token provided");
        }

        // Verify the old refresh token
        const decoded: any = verifyRefreshToken(oldRefreshToken);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return response(res, 401, "Invalid refresh token");
        }

        const newAccessToken = generateAccessToken((user._id as any).toString());
        const newRefreshToken = generateRefreshToken((user._id as any).toString());

        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        sendAuthCookies(res, newAccessToken, newRefreshToken, isLocalhost);

        return response(res, 200, "Token refreshed successfully");

    } catch (err) {
        // Optional: clear cookies on invalid token
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });

        return response(res, 401, "Invalid or expired refresh token");
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
    response(res, 200, "Logged out successfully")
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