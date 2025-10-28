import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { response } from '../utils/responseHandler';
export const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Get token from cookies
        const token = req.cookies?.authToken;
        if (!token || !process.env.JWT_SECRET) {
            return response(res, 401, "Authorization token or JWT secret missing");
        }
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ✅ Find user by ID
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return response(res, 403, "Not authorized, user not found");
        }
        // ✅ Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return response(res, 401, "Invalid or expired token");
    }
};
