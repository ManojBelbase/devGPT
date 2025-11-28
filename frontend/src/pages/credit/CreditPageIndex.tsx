
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/AppContext";
import { useKhalti } from "../../hooks/useKhalti";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { getPlansThunk } from "../../redux/thunks/planThunk";

const CreditPageIndex = () => {
    const { theme } = useAppContext();
    const { initiate, loading: khaltiLoading } = useKhalti();

    const dispatch = useDispatch<AppDispatch>();

    const { plans, loading } = useSelector(
        (state: RootState) => state.plan
    );

    useEffect(() => {
        dispatch(getPlansThunk());
    }, [dispatch]);

    const handleBuy = (planId: string) => {
        if (khaltiLoading) return;
        initiate(planId);
    };

    const isLoading = loading || khaltiLoading;

    return (
        <div
            className={`p-6 min-h-screen transition-colors duration-300 ${theme === "dark"
                ? "bg-[#121212] text-gray-100"
                : "bg-gray-50 text-gray-700"
                }`}
        >
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-3">Credit Plans</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Choose a plan that fits your usage and unlock premium AI features.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center my-10">
                    <Icon
                        icon="svg-spinners:180-ring"
                        className="text-4xl mx-auto text-purple-500"
                    />
                    <p className="mt-2 text-gray-500">Loading plans…</p>
                </div>
            )}

            {/* Error */}


            {/* Plans Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {!loading &&
                    plans &&
                    plans.map((plan) => (
                        <div
                            key={plan._id}
                            className={`rounded-3xl shadow-lg p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${theme === "dark"
                                ? "bg-gray-900 border-gray-700"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <Icon
                                    icon={
                                        plan.icon ||
                                        (plan._id === "basic"
                                            ? "mdi:account"
                                            : plan._id === "pro"
                                                ? "mdi:account-star"
                                                : "mdi:account-tie")
                                    }
                                    className="text-6xl text-purple-500 mb-5"
                                />

                                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>

                                <p className="text-4xl font-bold text-purple-500 mb-1">
                                    Rs.{plan.price}
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    {plan.credits} credits
                                </p>

                                {/* Features */}
                                <ul className="text-sm space-y-3 mb-6 w-full">
                                    {plan.features?.map((feature: string, i: number) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-2 justify-start text-gray-600 dark:text-gray-300"
                                        >
                                            <Icon
                                                icon="mdi:check-circle-outline"
                                                className="text-green-500"
                                            />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Buy Button */}
                                <button
                                    disabled={isLoading}
                                    onClick={() => handleBuy(plan._id)}
                                    className={`
        w-full py-3 rounded-sm font-semibold cursor-pointer 
        flex items-center justify-center gap-2
        text-white transition-all duration-200 
        ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
        bg-linear-to-r from-[#5A2C91] to-[#7D3BB4]
        shadow-sm shadow-purple-500/20
    `}
                                >
                                    {isLoading ? (
                                        <>
                                            <Icon icon="svg-spinners:180-ring" className="text-xl" />
                                            Processing…
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src="https://play-lh.googleusercontent.com/Xh_OlrdkF1UnGCnMN__4z-yXffBAEl0eUDeVDPr4UthOERV4Fll9S-TozSfnlXDFzw"
                                                className="w-6 h-6 object-contain rounded-sm"
                                                alt="Khalti"
                                            />
                                            Pay With Khalti
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CreditPageIndex;
