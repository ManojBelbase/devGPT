import { Response } from "express";

export const response = (
    res: Response,
    statusCode: number,
    message: string,
    data: any = null
) => {
    if (!res) {
        console.error("Response object is null");
        return;
    }

    const responseObject = {
        status: statusCode < 400 ? "Success" : "Error",
        message,
        data,
    };

    return res.status(statusCode).json(responseObject);
};