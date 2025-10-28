// models/transaction.model.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import { ITransaction } from '../types/types';



const transactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        planId: { type: String, required: true },
        amount: { type: Number, required: true }, // In paisa
        credits: { type: Number, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        pidx: { type: String }, // Khalti payment ID
        transactionId: { type: String }, // Khalti transaction ID
    },
    { timestamps: true }
);

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);