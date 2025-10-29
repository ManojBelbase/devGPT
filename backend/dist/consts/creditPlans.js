"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plans = void 0;
exports.plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
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
