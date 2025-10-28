import { useAppContext } from "../../context/AppContext";
import { Icon } from "@iconify/react";

const CreditPageIndex = () => {
    const { theme } = useAppContext();

    const plans = [
        {
            name: "Starter Plan",
            price: "$5",
            credits: "100 Credits",
            features: [
                "Basic AI text generation",
                "Limited image generation",
                "Standard support",
            ],
            icon: "mdi:rocket-launch-outline",
        },
        {
            name: "Pro Plan",
            price: "$15",
            credits: "500 Credits",
            features: [
                "Unlimited text generation",
                "High-quality image generation",
                "Priority support",
            ],
            icon: "mdi:crown-outline",
        },
        {
            name: "Enterprise Plan",
            price: "$30",
            credits: "1500 Credits",
            features: [
                "Custom AI tools",
                "Unlimited image & text",
                "24/7 dedicated support",
            ],
            icon: "mdi:office-building-outline",
        },
    ];

    return (
        <div
            className={`p-6 min-h-screen transition-colors duration-300 ${theme === "dark"
                ? "bg-[#121212] text-gray-100"
                : "bg-gray-50 text-gray-700"
                }`}
        >
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Credit Plans</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Choose a plan that fits your usage and unlock premium AI features.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl shadow-md p-6 border transition-all duration-300 hover:scale-105 hover:shadow-xl ${theme === "dark"
                            ? "bg-gray-900 border-gray-700"
                            : "bg-white border-gray-200"
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <Icon icon={plan.icon} className="text-5xl text-blue-500 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                            <p className="text-3xl font-bold text-blue-500 mb-1">
                                {plan.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {plan.credits}
                            </p>

                            <ul className="text-sm space-y-2 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-300"
                                    >
                                        <Icon
                                            icon="mdi:check-circle-outline"
                                            className="text-green-500"
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-2 rounded-xl font-semibold transition ${theme === "dark"
                                    ? "bg-blue-600 hover:bg-blue-500"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreditPageIndex;
