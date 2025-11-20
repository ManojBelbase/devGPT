// src/components/ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import { AIResponseParser } from 'ai-response-parser';
import Loader from "./ChatLoader";
import Logo from "./shared/Logo";
import ChatInput from "./ChatInput";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useAppContext } from "../context/AppContext";
import { generateImage, generateText } from "../api/chatApi";


const ChatBox = () => {
    const { user } = useAuth();
    const { selectedChat, refreshChats } = useChat();
    const { theme } = useAppContext();
    const isDark = theme === "dark";

    const [messages, setMessages] = useState<any[]>([]);
    const [prompt, setPrompt] = useState("");
    const [mode, setMode] = useState<"text" | "image">("text");
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if (selectedChat?.messages) {
            setMessages(selectedChat.messages);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !user || loading) return;

        const userMessage = {
            role: "user",
            type: mode,
            content: prompt.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentPrompt = prompt;
        setPrompt("");
        setLoading(true);

        try {
            const payload = { prompt: currentPrompt, chatId: selectedChat?._id };
            let aiResponse: any;

            if (mode === "text") {
                const { data } = await generateText(payload);
                aiResponse = { ...data.data, role: "assistant", timestamp: new Date() };
            } else {
                const { data } = await generateImage(payload);
                aiResponse = {
                    role: "assistant",
                    type: "image",
                    content: "Here's your generated image:",
                    image: data.data.imageUrl || data.data.image,
                    timestamp: new Date(),
                };
            }

            setMessages(prev => [...prev, aiResponse]);
            await refreshChats();
            if (!selectedChat) await refreshChats();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-black text-black dark:text-white">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {selectedChat?.title || "New Chat"}
                    </h1>
                    <span className="hidden sm:block text-sm text-gray-500">
                        {mode === "text" ? "Text Mode" : "Image Generation"}
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {messages.length === 0 && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center -mt-20">
                            <Logo />
                            <p className="text-4xl font-light text-center text-gray-500 dark:text-gray-400">
                                How can I help you today?
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {/* AI Avatar */}
                                    {msg.role === "assistant" && (
                                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                            <Icon icon="hugeicons:developer" className="text-white text-2xl" />
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={`max-w-3xl rounded-2xl px-6 py-4 shadow-lg ${msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : isDark
                                                ? "bg-gray-800 text-gray-100 rounded-tl-none"
                                                : "bg-white border border-gray-200 text-gray-900 rounded-tl-none"
                                            }`}
                                    >
                                        {msg.type === "image" && msg.image ? (
                                            <div>
                                                <p className="mb-4 opacity-90">{msg.content}</p>
                                                <img
                                                    src={msg.image}
                                                    alt="Generated"
                                                    className="rounded-xl max-w-full shadow-lg border border-gray-700"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : (
                                            // THIS IS THE ONLY CHANGE — USING YOUR PARSER
                                            <AIResponseParser
                                                content={msg.content || ""}
                                                darkMode={isDark}
                                                themeName={"dracula"}


                                            />
                                        )}
                                    </div>

                                    {/* User Avatar */}
                                    {msg.role === "user" && (
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user?.name?.[0] || "U"}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading */}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Icon icon="hugeicons:developer" className="text-white text-2xl" />
                                    </div>
                                    <div className={`rounded-2xl px-6 py-4 ${isDark ? "bg-gray-800" : "bg-white border"}`}>
                                        <Loader />
                                    </div>
                                </div>
                            )}

                            <div ref={endRef} />
                        </div>
                    )}
                </div>
            </div>

            <ChatInput
                prompt={prompt}
                setPrompt={setPrompt}
                mode={mode}
                setMode={setMode}
                loading={loading}
                handleSubmit={handleSubmit}
                inputRef={inputRef}
            />
        </div>
    );
};

export default ChatBox;