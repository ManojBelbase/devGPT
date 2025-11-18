import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        (req as any).user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Token expired or invalid" });
    }
};
