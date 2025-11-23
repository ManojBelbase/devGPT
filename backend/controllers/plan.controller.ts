// controllers/planController.ts
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
        const { planId, return_url } = req.body; // ← ADD return_url here
        const userId = (req as any).user._id;

        // Validate return_url (security)
        if (!return_url || !return_url.startsWith('https://devgptai.vercel.app/payment-success')) {
            return response(res, 400, 'Invalid return URL', null);
        }

        const plan = plans.find((p) => p._id === planId);
        if (!plan) {
            return response(res, 400, 'Invalid Plan', null);
        }

        const transaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: KhaltiService.formatAmount(plan.price),
            credits: plan.credits,
            isPaid: false,
        });

        // Use the dynamic return_url from frontend
        const khaltiResponse = await KhaltiService.initiatePayment({
            returnUrl: return_url, // ← NOW DYNAMIC!
            websiteUrl: 'https://devgptai.vercel.app',
            amount: KhaltiService.formatAmount(plan.price),
            purchaseOrderId: (transaction as any)._id.toString(),
            purchaseOrderName: `${plan.name} Plan`,
            customerInfo: {
                name: (req as any).user.name || 'Customer',
                email: (req as any).user.email || 'customer@example.com',
                phone: (req as any).user.phone || '9800000000',
            },
        });

        // Rest of your code (perfect)
        await Transaction.updateOne(
            { _id: transaction._id },
            { $set: { pidx: khaltiResponse.pidx } }
        );

        return response(res, 200, 'Payment initiated successfully', {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
        });
    } catch (error: any) {
        console.error('Purchase plan error:', error);
        return response(res, 500, 'Payment initiation failed', error.message);
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pidx } = req.query;

        if (!pidx || typeof pidx !== 'string') {
            return response(res, 400, 'Invalid pidx', null);
        }

        console.log('Verifying payment for pidx:', pidx);

        // Verify payment with Khalti
        const khaltiResponse = await KhaltiService.verifyPayment(pidx);

        console.log('Khalti lookup response:', {
            status: khaltiResponse.status,
            amount: khaltiResponse.amount,
            transaction_id: khaltiResponse.transaction_id,
        });

        // Find transaction in database
        const transaction = await Transaction.findOne({ pidx }).populate('userId');
        if (!transaction) {
            console.error('Transaction not found for pidx:', pidx);
            return response(res, 400, 'Transaction not found', null);
        }

        // Check if payment is completed
        if (KhaltiService.isPaymentCompleted(khaltiResponse.status)) {
            // Update transaction
            await Transaction.updateOne(
                { _id: transaction._id },
                {
                    $set: {
                        isPaid: true,
                        transactionId: khaltiResponse.transaction_id,
                    },
                }
            );

            // Add credits to user
            await User.updateOne(
                { _id: transaction.userId },
                { $inc: { credits: transaction.credits } }
            );

            console.log(`Credits updated for user ${transaction.userId}: +${transaction.credits}`);

            return response(res, 200, 'Payment verified successfully', {
                transactionId: khaltiResponse.transaction_id,
                amount: KhaltiService.parseAmount(khaltiResponse.amount),
                credits: transaction.credits,
            });
        } else {
            console.log('Payment not completed, status:', khaltiResponse.status);
            return response(res, 400, `Payment ${khaltiResponse.status.toLowerCase()}`, {
                status: khaltiResponse.status,
                transactionId: khaltiResponse.transaction_id || null,
            });
        }
    } catch (error: any) {
        console.error('Payment verification error:', error.message);
        return response(res, 500, 'Payment verification failed', error.message);
    }
};