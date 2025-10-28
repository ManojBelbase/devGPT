// src/hooks/useKhalti.ts
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export const useKhalti = () => {
    const [loading, setLoading] = useState(false);

    const initiate = async (planId: string) => {
        setLoading(true);
        try {
            const res = await api.post("api/payment/purchase-plan", { planId });
            const { payment_url } = res.data.data;
            window.location.href = payment_url;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return { initiate, loading };
};