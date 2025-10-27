// services/khaltiService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || '';

export const initiateKhaltiPayment = async (payload: {
    return_url: string;
    website_url: string;
    amount: number;
    purchase_order_id: string;
    purchase_order_name: string;
    customer_info: {
        name: string;
        email: string;
        phone: string;
    };
}): Promise<{ pidx: string; payment_url: string }> => {
    try {
        console.log('Initiating Khalti payment with payload:', payload);
        console.log('Using KHALTI_SECRET_KEY:', KHALTI_SECRET_KEY);

        const response = await axios.post(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            payload,
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { pidx, payment_url } = response.data;
        console.log('Khalti initiation response:', { pidx, payment_url });

        return { pidx, payment_url };
    } catch (error: any) {
        console.error('Khalti initiation error:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
    }
};

export const verifyKhaltiPayment = async (pidx: string): Promise<{
    status: string;
    amount: number;
    transaction_id: string;
}> => {
    try {
        console.log('Verifying Khalti payment for pidx:', pidx);

        const response = await axios.post(
            'https://a.khalti.com/api/v2/epayment/lookup/',
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { status, amount, transaction_id } = response.data;
        console.log('Khalti lookup response:', { status, amount, transaction_id });

        return { status, amount, transaction_id };
    } catch (error: any) {
        console.error('Khalti verification error:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
    }
};