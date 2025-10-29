"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhaltiService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || '';
const KHALTI_BASE_URL = 'https://a.khalti.com/api/v2/epayment';
class KhaltiService {
    static getHeaders() {
        return {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
    }
    /**
     * Initiate a payment with Khalti
     */
    static async initiatePayment(payload) {
        try {
            const response = await axios_1.default.post(`${KHALTI_BASE_URL}/initiate/`, {
                return_url: payload.returnUrl,
                website_url: payload.websiteUrl,
                amount: payload.amount,
                purchase_order_id: payload.purchaseOrderId,
                purchase_order_name: payload.purchaseOrderName,
                customer_info: payload.customerInfo,
            }, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            console.error('Khalti initiation error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Failed to initiate payment with Khalti');
        }
    }
    /**
     * Verify/lookup payment status
     */
    static async verifyPayment(pidx) {
        try {
            const response = await axios_1.default.post(`${KHALTI_BASE_URL}/lookup/`, { pidx }, { headers: this.getHeaders() });
            return response.data;
        }
        catch (error) {
            console.error('Khalti verification error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Failed to verify payment with Khalti');
        }
    }
    /**
     * Check if payment is completed
     */
    static isPaymentCompleted(status) {
        return status === 'Completed';
    }
    /**
     * Format amount for Khalti (convert to paisa - multiply by 100)
     */
    static formatAmount(amount) {
        return amount * 100;
    }
    /**
     * Parse amount from Khalti (convert from paisa - divide by 100)
     */
    static parseAmount(amount) {
        return amount / 100;
    }
}
exports.KhaltiService = KhaltiService;
