import { useAppContext } from "../../context/AppContext";
import { Icon } from "@iconify/react";
import { useKhalti } from "../../hooks/useKhalti";

const CreditPageIndex = () => {
    const { theme } = useAppContext();
    const { initiate, loading } = useKhalti();

    const plans = [
        {
            _id: "basic",
            name: "Basic",
            price: 10,
            icon: "mdi:account",
            credits: 100,
            features: [
                "100 text generations",
                "50 image generations",
                "Standard support",
                "Access to basic models",
            ],
        },
        {
            _id: "pro",
            name: "Pro",
            price: 25,
            icon: "mdi:account-star",
            credits: 300,
            features: [
                "300 text generations",
                "150 image generations",
                "Priority support",
                "Access to advanced models (Gemini 1.5 / GPT-4o-mini)",
                "Faster response times",
            ],
        },
        {
            _id: "premium",
            name: "Premium",
            icon: "mdi:account-tie",
            price: 50,
            credits: 800,
            features: [
                "800 text generations",
                "400 image generations",
                "24/7 premium support",
                "Access to all models (Gemini 2 / GPT-5)",
                "High-speed processing",
                "Early access to new AI tools",
            ],
        },
    ];

    const handleBuy = (planId: string) => {
        if (loading) return;
        initiate(planId);
    };

    return (
        <div
            className={`p-6 min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#121212] text-gray-100" : "bg-gray-50 text-gray-700"
                }`}
        >
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-3">Credit Plans</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Choose a plan that fits your usage and unlock premium AI features.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className={`rounded-3xl shadow-lg p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <Icon icon={plan.icon} className="text-6xl text-blue-500 mb-5" />
                            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>

                            <p className="text-4xl font-bold text-blue-500 mb-1">
                                Rs.{plan.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {plan.credits} credits
                            </p>

                            {/* Features */}
                            <ul className="text-sm space-y-3 mb-6 w-full">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 justify-start text-gray-600 dark:text-gray-300"
                                    >
                                        <Icon icon="mdi:check-circle-outline" className="text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <button
                                disabled={loading}
                                onClick={() => handleBuy(plan._id)}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2 ${loading
                                    ? "opacity-70 cursor-not-allowed"
                                    : theme === "dark"
                                        ? "bg-blue-600 hover:bg-blue-500"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Icon icon="svg-spinners:180-ring" className="text-xl" />
                                        Processing…
                                    </>
                                ) : (
                                    "Buy Now"
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toast container (optional) */}
        </div>
    );
};

export default CreditPageIndex;