// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import api from "../../api/axiosInstance";

type Status = "loading" | "success" | "failed" | "cancelled";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("Verifying your payment...");

    const pidx = searchParams.get("pidx");
    const statusParam = searchParams.get("status");

    useEffect(() => {
        // Case 1: No pidx
        if (!pidx) {
            setStatus("failed");
            setMessage("Invalid payment link. Missing transaction ID.");
            toast.error("Invalid payment link");
            return;
        }

        // Case 2: User cancelled payment
        if (statusParam === "User canceled" || statusParam === "Cancelled") {
            setStatus("cancelled");
            setMessage("Payment was cancelled.");
            toast.error("Payment cancelled");
            setTimeout(() => navigate("/credits"), 4000);
            return;
        }

        // Case 3: Verify payment
        const verify = async () => {
            try {
                const res = await api.get(`/payment/verify-payment?pidx=${pidx}`);

                if (res.data.status === "success") {
                    const { credits } = res.data.data;

                    setStatus("success");
                    setMessage(`Success! +${credits} credits added`);
                    toast.success(`+${credits} credits added!`);

                    setTimeout(() => navigate("/chat"), 4000);
                } else {
                    throw new Error(res.data.message || "Payment failed");
                }
            } catch (err: any) {
                console.error("Payment verify error:", err);
                setStatus("failed");
                setMessage("Payment failed or already processed.");
                toast.error("Payment verification failed");
            }
        };

        verify();
    }, [pidx, statusParam, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-black px-6">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center">

                {/* Loading */}
                {status === "loading" && (
                    <>
                        <Icon icon="svg-spinners:180-ring" className="text-7xl text-blue-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Processing...</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-3">{message}</p>
                    </>
                )}

                {/* Success */}
                {status === "success" && (
                    <>
                        <Icon icon="mdi:check-circle" className="text-8xl text-green-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Payment Successful!</h1>
                        <p className="text-xl text-gray-700 dark:text-gray-200 mt-4">{message}</p>
                        <p className="text-sm text-gray-500 mt-6">Redirecting to chat...</p>
                    </>
                )}

                {/* Cancelled */}
                {status === "cancelled" && (
                    <>
                        <Icon icon="mdi:cancel" className="text-8xl text-orange-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">Payment Cancelled</h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">{message}</p>
                        <button
                            onClick={() => navigate("/credits")}
                            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                        >
                            Back to Plans
                        </button>
                    </>
                )}

                {/* Failed */}
                {status === "failed" && (
                    <>
                        <Icon icon="mdi:close-circle" className="text-8xl text-red-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Payment Failed</h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">{message}</p>
                        <button
                            onClick={() => navigate("/credits")}
                            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;