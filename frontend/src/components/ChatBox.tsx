// src/components/ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";

import Loader from "./ChatLoader";
import Logo from "./shared/Logo";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useAppContext } from "../context/AppContext";
import { generateImage, generateText } from "../api/chatApi";

const ChatBox = () => {
    const { user } = useAuth();
    const { selectedChat, refreshChats } = useChat();
    console.log(selectedChat, 'sec')
    const { theme } = useAppContext();
    const isDark = theme === "dark";

    const [messages, setMessages] = useState<any[]>([]);
    const [prompt, setPrompt] = useState("");
    const [mode, setMode] = useState<"text" | "image">("text");
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
    }, [messages, loading]);

    // Focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !user || loading) return;

        const userMessage = {
            role: "user",
            type: mode,
            content: prompt.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
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

            setMessages((prev) => [...prev, aiResponse]);
            await refreshChats();
            if (!selectedChat) await refreshChats();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const copyToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Copied to clipboard!", { duration: 2000, position: "bottom-center" });
        } catch {
            toast.error("Failed to copy");
        }
    };

    const renderContent = (content: string) => {
        const parts = content.split(/(```[\w]*\n[\s\S]*?\n```)/g);

        return parts.map((part, i) => {
            const match = part.match(/```([\w]*)\n([\s\S]*?)\n```/);
            if (match) {
                const language = (match[1] || "text").trim();
                const code = match[2].trim();

                return (
                    <div key={i} className="my-4 group relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {language || "code"}
                            </span>
                            <button
                                onClick={() => copyToClipboard(code)}
                                className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                            >
                                <Icon icon="material-symbols:content-copy-rounded" fontSize={15} />
                                Copy
                            </button>
                        </div>

                        <SyntaxHighlighter
                            language={language}
                            style={isDark ? vscDarkPlus : prism}
                            customStyle={{
                                margin: 0,
                                borderRadius: "0 0 0.5rem 0.5rem",
                                fontSize: "14px",
                                padding: "1rem",
                            }}
                            showLineNumbers
                            wrapLongLines
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            if (part.trim()) {
                return (
                    <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
                        {part}
                    </p>
                );
            }
            return null;
        });
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
                        {mode === "text" ? " Text Mode" : "Image Generation"}
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
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            <Icon icon={`hugeicons:developer`} fontSize={40} className={`bg-linear-to-r cursor-pointer p-1 rounded-md from-[#a456f7] to-[#3d81f6] ${theme === "dark" ? "text-white/70" : "text-gray-800"}`}
                                            />                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={`max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-sm px-6 py-2 shadow-sm ${msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : isDark
                                                ? "bg-gray-800 rounded-tl-none"
                                                : "bg-white border border-gray-200 rounded-tl-none"
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
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                {renderContent(msg.content || "")}
                                            </div>
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

                            {/* Loading State */}
                            {loading && (
                                <div className="flex gap-4">
                                    <Icon icon={`hugeicons:developer`} fontSize={40} className={`bg-linear-to-r cursor-pointer p-1 rounded-md from-[#a456f7] to-[#3d81f6] ${theme === "dark" ? "text-white/70" : "text-gray-800"}`}
                                    />
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

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <div className="max-w-5xl mx-auto px-4 py-5">
                    <form onSubmit={handleSubmit} className="flex items-end gap-1">
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as "text" | "image")}
                            className={`px-4 py-4 rounded-sm text-sm font-medium outline-none transition-all ${isDark
                                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                        </select>

                        <div className="flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={mode === "image" ? "Describe the image..." : "Send a message..."}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                className={`w-full px-5 py-3 rounded-sm outline-none transition-all border ${isDark
                                    ? "bg-gray-900 border-gray-700 focus:border-blue-500"
                                    : "bg-gray-50 border-gray-300 focus:border-blue-500"
                                    }`}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!prompt.trim() || loading}
                            className={`p-3 rounded-sm transition-all shadow-lg ${prompt.trim() && !loading
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <Icon icon="material-symbols:send-rounded" fontSize={24} />
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        devGPT can make mistakes. Think carefully.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;