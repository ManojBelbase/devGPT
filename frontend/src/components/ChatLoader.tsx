import { useState, useEffect } from 'react';

const ultraShort = [
    "Generating",
    "Almost there",
    "Thinking hard",
    "One sec",
    "Hold tight",
    "Typing fast",
    "Code incoming",
    "Magic happening",
    "Final touches",
    "Just a moment",
];

const ChatLoader = () => {
    const [message, setMessage] = useState(ultraShort[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const next = ultraShort[Math.floor(Math.random() * ultraShort.length)];
                return next === prev ? ultraShort[(ultraShort.indexOf(prev) + 1) % ultraShort.length] : next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 py-1">

            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                {message}
            </span>
            <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"></div>
            </div>
        </div>
    );
};

export default ChatLoader;