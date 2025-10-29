"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.purchasePlan = exports.getPlans = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const creditPlans_1 = require("../consts/creditPlans");
const transaction_model_1 = require("../models/transaction.model");
const user_model_1 = require("../models/user.model");
const khaltiServices_1 = require("../services/khaltiServices");
const getPlans = async (req, res) => {
    try {
        return (0, responseHandler_1.response)(res, 200, 'Credit plans fetched successfully', creditPlans_1.plans);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, 'Internal server error', error.message);
    }
};
exports.getPlans = getPlans;
const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        // Find the plan
        const plan = creditPlans_1.plans.find((p) => p._id === planId);
        if (!plan) {
            return (0, responseHandler_1.response)(res, 400, 'Invalid Plan', null);
        }
        // Create transaction record
        const transaction = await transaction_model_1.Transaction.create({
            userId,
            planId: plan._id,
            amount: khaltiServices_1.KhaltiService.formatAmount(plan.price),
            credits: plan.credits,
            isPaid: false,
        });
        console.log('Initiating Khalti payment for transaction:', transaction._id);
        // Initiate payment with Khalti
        const khaltiResponse = await khaltiServices_1.KhaltiService.initiatePayment({
            returnUrl: 'http://localhost:3000/payment-success',
            websiteUrl: 'http://localhost:3000',
            amount: khaltiServices_1.KhaltiService.formatAmount(plan.price),
            purchaseOrderId: transaction._id.toString(),
            purchaseOrderName: plan.name,
            customerInfo: {
                name: req.user.name || 'Test User',
                email: req.user.email || 'test@example.com',
                phone: '9800000000',
            },
        });
        console.log('Khalti response:', {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
        });
        // Update transaction with pidx
        await transaction_model_1.Transaction.updateOne({ _id: transaction._id }, { $set: { pidx: khaltiResponse.pidx } });
        return (0, responseHandler_1.response)(res, 200, 'Payment initiated successfully', {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
        });
    }
    catch (error) {
        console.error('Purchase plan error:', error.message);
        return (0, responseHandler_1.response)(res, 500, 'Payment initiation failed', error.message);
    }
};
exports.purchasePlan = purchasePlan;
const verifyPayment = async (req, res) => {
    try {
        const { pidx } = req.query;
        if (!pidx || typeof pidx !== 'string') {
            return (0, responseHandler_1.response)(res, 400, 'Invalid pidx', null);
        }
        console.log('Verifying payment for pidx:', pidx);
        // Verify payment with Khalti
        const khaltiResponse = await khaltiServices_1.KhaltiService.verifyPayment(pidx);
        console.log('Khalti lookup response:', {
            status: khaltiResponse.status,
            amount: khaltiResponse.amount,
            transaction_id: khaltiResponse.transaction_id,
        });
        // Find transaction in database
        const transaction = await transaction_model_1.Transaction.findOne({ pidx }).populate('userId');
        if (!transaction) {
            console.error('Transaction not found for pidx:', pidx);
            return (0, responseHandler_1.response)(res, 400, 'Transaction not found', null);
        }
        // Check if payment is completed
        if (khaltiServices_1.KhaltiService.isPaymentCompleted(khaltiResponse.status)) {
            // Update transaction
            await transaction_model_1.Transaction.updateOne({ _id: transaction._id }, {
                $set: {
                    isPaid: true,
                    transactionId: khaltiResponse.transaction_id,
                },
            });
            // Add credits to user
            await user_model_1.User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
            console.log(`Credits updated for user ${transaction.userId}: +${transaction.credits}`);
            return (0, responseHandler_1.response)(res, 200, 'Payment verified successfully', {
                transactionId: khaltiResponse.transaction_id,
                amount: khaltiServices_1.KhaltiService.parseAmount(khaltiResponse.amount),
                credits: transaction.credits,
            });
        }
        else {
            console.log('Payment not completed, status:', khaltiResponse.status);
            return (0, responseHandler_1.response)(res, 400, `Payment ${khaltiResponse.status.toLowerCase()}`, {
                status: khaltiResponse.status,
                transactionId: khaltiResponse.transaction_id || null,
            });
        }
    }
    catch (error) {
        console.error('Payment verification error:', error.message);
        return (0, responseHandler_1.response)(res, 500, 'Payment verification failed', error.message);
    }
};
exports.verifyPayment = verifyPayment;
