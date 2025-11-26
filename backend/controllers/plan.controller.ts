// src/controllers/planController.ts

import { Request, Response } from 'express';
import { response } from '../utils/responseHandler';
import { plans } from '../consts/creditPlans';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import { KhaltiService } from '../services/khaltiServices';

export const getPlans = async (req: Request, res: Response): Promise<any> => {
    try {
        return response(res, 200, 'Credit plans fetched successfully', plans);
    } catch (error: any) {
        return response(res, 500, 'Internal server error', error.message);
    }
};

export const purchasePlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const { planId, return_url } = req.body;
        const userId = (req as any).user._id;

        // ─────── SECURITY: Validate return_url ───────
        if (!return_url) {
            return response(res, 400, 'return_url is required', null);
        }

        // Allow only your domains (add localhost for testing)
        const allowedOrigins = [
            'https://devgptai.vercel.app',
            'http://localhost:3000',        // remove this in production if you want
        ];

        const isAllowed = allowedOrigins.some(origin => return_url.startsWith(origin));
        if (!isAllowed) {
            return response(res, 400, 'Invalid return_url domain', null);
        }
        // ─────────────────────────────────────────────

        const plan = plans.find(p => p._id === planId);
        if (!plan) {
            return response(res, 400, 'Invalid plan selected', null);
        }

        // Create pending transaction
        const transaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: KhaltiService.formatAmount(plan.price), // in paisa
            credits: plan.credits,
            isPaid: false,
        });

        // ensure we have a string id for purchaseOrderId and updates
        const transactionId = (transaction as any)._id?.toString?.() ?? String((transaction as any)._id);

        // Initiate payment with Khalti
        const khaltiResponse = await KhaltiService.initiatePayment({
            returnUrl: return_url,                         // now dynamic & correct
            websiteUrl: 'https://devgptai.vercel.app',
            amount: KhaltiService.formatAmount(plan.price),
            purchaseOrderId: transactionId,
            purchaseOrderName: `${plan.name} Credit Plan`,
            customerInfo: {
                name: (req as any).user.name || 'User',
                email: (req as any).user.email || 'user@example.com',
                phone: (req as any).user.phone || '9800000000',
            },
        });

        // Save pidx to transaction so we can verify later
        await Transaction.findByIdAndUpdate(transactionId, {
            pidx: khaltiResponse.pidx,
        });

        return response(res, 200, 'Payment initiated', {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
        });
    } catch (error: any) {
        console.error('Purchase plan error:', error);
        return response(res, 500, 'Failed to initiate payment', error.message || error);
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pidx } = req.query;

        if (!pidx || typeof pidx !== 'string') {
            return response(res, 400, 'Missing or invalid pidx', null);
        }

        console.log('Verifying pidx →', pidx);

        // Step 1: Verify with Khalti
        const khaltiData = await KhaltiService.verifyPayment(pidx);

        console.log('Khalti verification response:', {
            status: khaltiData.status,
            transaction_id: khaltiData.transaction_id,
            amount: khaltiData.amount,
        });

        // Step 2: Find transaction by pidx
        const transaction = await Transaction.findOne({ pidx }).populate('userId');
        if (!transaction) {
            return response(res, 404, 'Transaction not found', null);
        }

        // Prevent double-spending
        if (transaction.isPaid) {
            return response(res, 200, 'Payment already processed', {
                credits: transaction.credits,
            });
        }

        // Step 3: Check if payment is actually completed
        if (KhaltiService.isPaymentCompleted(khaltiData.status)) {
            // Mark as paid
            await Transaction.findByIdAndUpdate(transaction._id, {
                isPaid: true,
                transactionId: khaltiData.transaction_id,
                status: khaltiData.status,
                verifiedAt: new Date(),
            });

            // Add credits to user
            await User.findByIdAndUpdate(transaction.userId, {
                $inc: { credits: transaction.credits },
            });

            console.log(`Credits added: +${transaction.credits} to user ${transaction.userId}`);

            return response(res, 200, 'Payment successful', {
                credits: transaction.credits,
                transactionId: khaltiData.transaction_id,
                amount: KhaltiService.parseAmount(khaltiData.amount),
            });
        } else {
            // Payment pending / failed / refunded
            await Transaction.findByIdAndUpdate(transaction._id, {
                status: khaltiData.status,
            });

            return response(res, 400, `Payment ${khaltiData.status.toLowerCase()}`, {
                status: khaltiData.status,
            });
        }
    } catch (error: any) {
        console.error('Verify payment error:', error);
        return response(res, 500, 'Verification failed', error.message || error);
    }
};