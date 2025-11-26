import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export const useKhalti = () => {
    const [loading, setLoading] = useState(false);

    const initiate = async (planId: string) => {
        setLoading(true);
        try {
            const res = await api.post("/payment/purchase-plan", {
                planId,
                return_url: "https://devgptai.vercel.app/payment-success",
            });

            if (res.data.status === "success") {
                window.location.href = res.data.data.payment_url;
            } else {
                toast.error("Failed to start payment");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return { initiate, loading };
};