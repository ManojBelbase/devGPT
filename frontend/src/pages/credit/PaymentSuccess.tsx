// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("Verifying payment…");

    const pidx = new URLSearchParams(location.search).get("pidx");

    useEffect(() => {
        if (!pidx) {
            setMsg("Invalid payment link.");
            return;
        }

        const verify = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8001/api/verify-payment?pidx=${pidx}`
                );

                if (res.data.status === "Success") {
                    toast.success(
                        `Success! +${res.data.data.credits} credits added.`
                    );
                    setMsg(
                        `Payment completed! Credits: ${res.data.data.credits} | TxID: ${res.data.data.transactionId}`
                    );
                    // Optional: redirect to dashboard after 3s
                    setTimeout(() => navigate("/dashboard"), 3000);
                } else {
                    toast.error(res.data.message);
                    setMsg(res.data.message);
                }
            } catch (err: any) {
                toast.error("Verification failed");
                setMsg("Verification failed");
            }
        };

        verify();
    }, [pidx, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#121212] p-6">
            <Icon icon="mdi:check-circle" className="text-6xl text-green-500 mb-4" />
            <p className="text-xl">{msg}</p>
        </div>
    );
};

export default PaymentSuccess;