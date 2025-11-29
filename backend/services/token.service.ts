import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: "2d",
    });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET!, {
        expiresIn: "30d",
    });
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_SECRET!);
};
