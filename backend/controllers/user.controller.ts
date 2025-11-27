import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { User } from "../models/user.model";
import { Chat } from "../models/chat.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/token.service";
import { sendAuthCookies } from "../utils/sendCookies";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

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
            accessToken
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
            accessToken,
        }
        )

    } catch {
        return response(res, 500, "Internal server error");
    }
};


// google login 
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { token } = req.body; // ID token from frontend

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return response(res, 401, "Invalid Google token");
        }

        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return response(res, 400, "No email provided by Google");
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (no password for social login)
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                password: "GOOGLE_OAUTH_" + googleId, // dummy password
                // You can add a field like `googleId` or `authProvider` if you want
            });
        }

        // Generate tokens (same as normal login)
        const accessToken = generateAccessToken((user._id as any).toString());
        const refreshToken = generateRefreshToken((user._id as any).toString());

        const isLocalhost = req.headers.origin?.includes("localhost") ?? false;
        sendAuthCookies(res, accessToken, refreshToken, isLocalhost);

        return response(res, 200, "Google login successful", {
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            accessToken,
        });
    } catch (err: any) {
        console.error("Google auth error:", err);
        return response(res, 500, "Google authentication failed");
    }
};


// Refresh
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
    const isLocalhost = req.headers.origin?.includes("localhost") ?? false;

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

    // Also clear from localStorage via frontend response
    res.json({ message: "Logged out", clearLocalStorage: true });
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