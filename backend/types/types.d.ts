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

export interface KhaltiInitiatePayload {
    returnUrl: string;
    websiteUrl: string;
    amount: number;
    purchaseOrderId: string;
    purchaseOrderName: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface KhaltiInitiateResponse {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}
export interface KhaltiLookupResponse {
    pidx: string;
    status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Expired' | 'User canceled';
    transaction_id: string | null;
    amount: number;
    total_amount: number;
    fee: number;
    refunded: boolean;
}