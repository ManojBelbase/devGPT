// models/transaction.model.ts
import mongoose, { Schema } from 'mongoose';
const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    amount: { type: Number, required: true }, // In paisa
    credits: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    pidx: { type: String }, // Khalti payment ID
    transactionId: { type: String }, // Khalti transaction ID
}, { timestamps: true });
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
