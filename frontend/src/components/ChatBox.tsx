// src/components/ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import toast from "react-hot-toast";
import Loader from "./ChatLoader";        // your loader component
import Message from "./Message";          // your Message component
import Logo from "./shared/Logo";         // your logo
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useAppContext } from "../context/AppContext";
import { generateImage, generateText } from "../api/chatApi";

const ChatBox = () => {
    const { user } = useAuth();
    const { selectedChat, refreshChats } = useChat();

    const { theme } = useAppContext(); // optional: remove if you moved theme to Redux too

    const [messages, setMessages] = useState<any[]>([]);
    const [prompt, setPrompt] = useState("");
    const [mode, setMode] = useState<"text" | "image">("text");
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // Load messages from selected chat
    useEffect(() => {
        if (selectedChat?.messages) {
            setMessages(selectedChat.messages);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !user) return;

        const userMessage = {
            role: "user",
            type: mode,
            content: prompt,
        };

        // Optimistic UI
        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");
        setLoading(true);

        try {
            const payload = {
                prompt,
                chatId: selectedChat?._id,
            };

            let aiResponse: any;

            if (mode === "text") {
                const { data } = await generateText(payload);
                aiResponse = data.data; // adjust if your API structure is different
            } else {
                const { data } = await generateImage(payload);
                aiResponse = data.data;
            }

            setMessages((prev) => [...prev, aiResponse]);

            // Refresh chat list (updates message count, last message, etc.)
            await refreshChats();

            // If it was a new chat (no selectedChat before), refresh again to get the new chat ID
            if (!selectedChat) await refreshChats();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
            // Remove user message on error
            setMessages((prev) => prev.filter((m) => m !== userMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`h-[90vh] flex flex-col mx-5 md:mx-10 mt-5 md:mt-10 xl:mx-30 2xl:pr-40 ${theme === "dark" ? "text-white" : "text-black"
                }`}
        >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <Logo />
                        <p
                            className={`mt-5 text-4xl sm:text-6xl text-center font-light ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            {selectedChat ? "No messages yet" : "Ask me anything"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {messages.map((m, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <Message message={m} />
                                {m.image && (
                                    <img
                                        src={m.image}
                                        alt={m.content}
                                        className="rounded-xl mt-1 max-w-full md:max-w-lg shadow"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                        <div ref={endRef} />
                        {loading && <Loader />}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="w-full mt-2">
                <div
                    className={`flex items-center gap-3 px-4 py-2 border rounded-full transition-all ${theme === "dark"
                        ? "border-gray-700 bg-gray-900 focus-within:border-blue-500 focus-within:bg-gray-800"
                        : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:bg-gray-50"
                        }`}
                >
                    {/* Mode Switcher */}
                    <div className="relative">
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as "text" | "image")}
                            className={`appearance-none pr-6 text-sm bg-transparent outline-none cursor-pointer ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                                }`}
                        >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                        </select>
                        <Icon
                            icon="mdi:chevron-down"
                            className="absolute right-1 top-1.5 pointer-events-none text-gray-400"
                            fontSize={18}
                        />
                    </div>

                    {/* Prompt Input */}
                    <input
                        type="text"
                        placeholder={mode === "image" ? "Generate an image ..." : "Type your message ..."}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder-opacity-60 ${theme === "dark"
                            ? "text-white placeholder-gray-500"
                            : "text-black placeholder-gray-400"
                            }`}
                        disabled={loading}
                    />

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || loading}
                        className={`p-2 rounded-full transition-all ${prompt.trim() && !loading
                            ? theme === "dark"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            : theme === "dark"
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <Icon icon="material-symbols:send" fontSize={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;