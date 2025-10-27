import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    credits: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface AuthRequest extends Request {
    user?: { _id: string; name: string };
}