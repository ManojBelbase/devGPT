// controllers/planController.ts
import { Request, Response } from 'express';
import { response } from '../utils/responseHandler';
import { plans } from '../consts/creditPlans';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || '';

export const getPlans = async (req: Request, res: Response): Promise<any> => {
    try {
        return response(res, 200, 'Credit plans fetched successfully', plans);
    } catch (error: any) {
        return response(res, 500, 'Internal server error', error.message);
    }
};

export const purchasePlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const { planId } = req.body;
        const userId = (req as any).user._id;

        const plan = plans.find((plan) => plan._id === planId);
        if (!plan) {
            return response(res, 400, 'Invalid Plan', null);
        }

        const transaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: plan.price * 100,
            credits: plan.credits,
            isPaid: false,
        });

        console.log('Initiating Khalti payment for transaction:', transaction._id);
        console.log('Using KHALTI_SECRET_KEY:', KHALTI_SECRET_KEY);

        const khaltiResponse = await axios.post(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            {
                return_url: 'http://localhost:3000/payment-success',
                website_url: 'http://localhost:3000',
                amount: plan.price * 100,
                purchase_order_id: (transaction as any)._id.toString(),
                purchase_order_name: plan.name,
                customer_info: {
                    name: (req as any).user.name || 'Test User',
                    email: (req as any).user.email || 'test@example.com',
                    phone: '9800000000',
                },
            },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { pidx, payment_url } = khaltiResponse.data;
        console.log('Khalti response:', { pidx, payment_url });

        await Transaction.updateOne({ _id: transaction._id }, { $set: { pidx } });

        return response(res, 200, 'Payment initiated successfully', { pidx, payment_url });
    } catch (error: any) {
        console.error('Khalti initiation error:', error.response ? error.response.data : error.message);
        return response(res, 500, 'Payment initiation failed', error.response ? error.response.data : error.message);
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pidx } = req.query;

        if (!pidx || typeof pidx !== 'string') {
            return response(res, 400, 'Invalid pidx', null);
        }

        console.log('Verifying payment for pidx:', pidx);

        const lookupResponse = await axios.post(
            'https://a.khalti.com/api/v2/epayment/lookup/',
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { status, amount, transaction_id } = lookupResponse.data;
        console.log('Khalti lookup response:', { status, amount, transaction_id });

        const transaction = await Transaction.findOne({ pidx }).populate('userId');
        if (!transaction) {
            console.error('Transaction not found for pidx:', pidx);
            return response(res, 400, 'Transaction not found', null);
        }

        if (status === 'Completed') {
            await Transaction.updateOne(
                { _id: transaction._id },
                { $set: { isPaid: true, transactionId: transaction_id } }
            );

            await User.updateOne(
                { _id: transaction.userId },
                { $inc: { credits: transaction.credits } }
            );

            console.log(`Credits updated for user ${transaction.userId}: +${transaction.credits}`);

            return response(res, 200, 'Payment verified successfully', {
                transactionId: transaction_id,
                amount: amount / 100,
                credits: transaction.credits,
            });
        } else {
            console.log('Payment not completed, status:', status);
            return response(res, 400, `Payment ${status.toLowerCase()}`, {
                status,
                transactionId: transaction_id || null,
            });
        }
    } catch (error: any) {
        console.error('Payment verification error:', error.response ? error.response.data : error.message);
        return response(res, 500, 'Payment verification failed', error.response ? error.response.data : error.message);
    }
}