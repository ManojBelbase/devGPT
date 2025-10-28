import axios from 'axios';
import dotenv from 'dotenv';
import { KhaltiInitiatePayload, KhaltiInitiateResponse, KhaltiLookupResponse } from '../types/types';
dotenv.config();

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || '';
const KHALTI_BASE_URL = 'https://a.khalti.com/api/v2/epayment';

export class KhaltiService {
    private static getHeaders() {
        return {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Initiate a payment with Khalti
     */
    static async initiatePayment(payload: KhaltiInitiatePayload): Promise<KhaltiInitiateResponse> {
        try {
            const response = await axios.post(
                `${KHALTI_BASE_URL}/initiate/`,
                {
                    return_url: payload.returnUrl,
                    website_url: payload.websiteUrl,
                    amount: payload.amount,
                    purchase_order_id: payload.purchaseOrderId,
                    purchase_order_name: payload.purchaseOrderName,
                    customer_info: payload.customerInfo,
                },
                { headers: this.getHeaders() }
            );

            return response.data;
        } catch (error: any) {
            console.error('Khalti initiation error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Failed to initiate payment with Khalti');
        }
    }

    /**
     * Verify/lookup payment status
     */
    static async verifyPayment(pidx: string): Promise<KhaltiLookupResponse> {
        try {
            const response = await axios.post(
                `${KHALTI_BASE_URL}/lookup/`,
                { pidx },
                { headers: this.getHeaders() }
            );

            return response.data;
        } catch (error: any) {
            console.error('Khalti verification error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.detail || 'Failed to verify payment with Khalti');
        }
    }

    /**
     * Check if payment is completed
     */
    static isPaymentCompleted(status: string): boolean {
        return status === 'Completed';
    }

    /**
     * Format amount for Khalti (convert to paisa - multiply by 100)
     */
    static formatAmount(amount: number): number {
        return amount * 100;
    }

    /**
     * Parse amount from Khalti (convert from paisa - divide by 100)
     */
    static parseAmount(amount: number): number {
        return amount / 100;
    }
}