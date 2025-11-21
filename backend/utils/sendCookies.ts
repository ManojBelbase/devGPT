import { Response } from "express";

export const sendAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
    isLocalhost: boolean
) => {
    const cookieConfig = {
        httpOnly: true,
        secure: !isLocalhost,
        sameSite: isLocalhost ? ("lax" as const) : ("none" as const),
        domain: isLocalhost ? "localhost" : "devgptai.vercel.app",
        path: "/",
    };

    // Access Token — 15 minutes
    res.cookie("accessToken", accessToken, {
        ...cookieConfig,
        maxAge: 15 * 60 * 1000,
    });

    // Refresh Token — 30 days
    res.cookie("refreshToken", refreshToken, {
        ...cookieConfig,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};
