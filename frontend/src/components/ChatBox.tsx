import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { AIResponseParser } from "ai-response-parser";
import ChatInput from "./ChatInput";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useAppContext } from "../context/AppContext";
import { generateImage, generateText } from "../api/chatApi";
import ChatLoader from "./ChatLoader";

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
    const inputRef = useRef<HTMLTextAreaElement>(null!);

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

    // Ultimate image URL detector — works with ALL your message formats
    const extractImageUrl = (msg: any): string | null => {
        // Case 1: Direct URL in content (very old format)
        if (typeof msg.content === "string" && msg.content.includes("https://ik.imagekit.io")) {
            return msg.content;
        }

        // Case 2: .image field (most common now)
        if (msg.image) return msg.image;

        // Case 3: .imageUrl field (newer)
        if (msg.imageUrl) return msg.imageUrl;

        // Case 4: content is object with image inside (rare)
        if (msg.content && typeof msg.content === "object") {
            return msg.content.image || msg.content.imageUrl || null;
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
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
                    imageUrl: data.data.imageUrl || data.data.image, // standardize to imageUrl
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

    return (
        <div className="flex flex-col h-[90vh] sm:h-screen md:h-screen lg:h-screen xl:h-screen 2xl:h-screen">
            {/* Header */}
            {/* <div className="border-b border-gray-200 dark:border-gray-800 px-1 py-2 sm:py-3 sticky top-0   bg-linear-to-b from-white to-gray-100
  dark:bg-linear-to-b dark:from-black dark:to-gray-900 z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-base sm:text-lg font-medium truncate max-w-[70vw]">
                        {selectedChat?.title || "New Chat"}
                    </h1>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {mode === "text" ? "Text Mode" : "Image Mode"}
                    </span>
                </div>
            </div> */}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 pb-28 sm:pb-32">
                <div className="max-w-5xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
                    {messages.length === 0 && !loading ? (
                        <div className=" flex flex-col  items-center ">
                            {/* <Logo /> */}
                            <p className="text-2xl sm:text-4xl font-light text-center text-gray-500 dark:text-gray-400 mt-4">
                                How can I help you today?
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 sm:space-y-8">
                            {messages.map((msg, i) => {
                                const isUser = msg.role === "user";
                                const imageUrl = extractImageUrl(msg);
                                const isImageMessage = !!imageUrl;

                                const messageBg = isUser
                                    ? isDark
                                        ? "bg-gray-800"
                                        : "bg-gray-100"
                                    : isDark
                                        ? "bg-gray-950"
                                        : "bg-white ";

                                return (
                                    <div
                                        key={i}
                                        className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        {/* AI Avatar */}
                                        {!isUser && (
                                            <div className="hidden sm:flex w-10 h-10 rounded-full mt-4 -mr-3 bg-linear-to-r from-purple-500 to-blue-500 items-center justify-center shrink-0">
                                                <Icon icon="hugeicons:developer" className="text-white text-xl" />
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div
                                            className={`
                        p-3 sm:p-3 rounded-xl ${isUser ? "rounded-br-md" : "rounded-tl-md"}
                        ${messageBg} 
                        max-w-full sm:max-w-[80%]
                      `}
                                        >
                                            {isImageMessage ? (
                                                <div className="flex flex-col space-y-1">
                                                    {/* Show caption only if it's not the image URL */}
                                                    {msg.content &&
                                                        typeof msg.content === "string" &&
                                                        !msg.content.includes("https://ik.imagekit.io") && (
                                                            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                                                {msg.content}
                                                            </p>
                                                        )}

                                                    <div className="relative group grid-cols-2 grid">
                                                        <img
                                                            src={imageUrl!}
                                                            alt="AI Generated"
                                                            className=" max-w-full w-full h-auto transition-transform group-hover:scale-101"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/fallback-image.png";
                                                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                                            }}
                                                        />
                                                        <p className="hidden text-red-500 text-xs mt-1">Failed to load image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <AIResponseParser
                                                    content={msg.content || ""}
                                                    textColor={
                                                        isUser
                                                            ? isDark
                                                                ? "#E5E5E5"
                                                                : "#1F2937"
                                                            : isDark
                                                                ? "#D4D4D4"
                                                                : "#333333"
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* User Avatar */}
                                        {isUser && (
                                            <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-600 items-center justify-center text-white font-bold text-sm shrink-0">
                                                {user?.name?.[0] || "U"}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Loading State */}
                            {loading && (
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-blue-500 items-center justify-center shrink-0">
                                        <Icon icon="hugeicons:developer" className="text-white text-2xl" />
                                    </div>
                                    <div className={`rounded-2xl px-4 py-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                                        <ChatLoader />
                                    </div>
                                </div>
                            )}

                            <div ref={endRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Input */}
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