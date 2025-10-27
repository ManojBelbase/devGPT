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

interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    planId: string;
    amount: number;
    credits: number;
    isPaid: boolean;
    pidx?: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}