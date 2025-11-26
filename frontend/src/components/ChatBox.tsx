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
        // Scroll to the bottom of the chat when messages or loading state changes
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        // Focus on the input when component mounts
        inputRef.current?.focus();
    }, []);

    const extractImageUrl = (msg: any): string | null => {
        // Case 1: Direct URL in content (very old format)
        if (typeof msg.content === "string" && msg.content.includes("https://ik.imagekit.io")) {
            return msg.content;
        }

        // Case 2: .image field (most common now)
        if (msg.image) return msg.image;

        // Case 3: .imageUrl field (newer)
        if (msg.imageUrl) return msg.imageUrl;

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
                // Ensure text response is parsed correctly if using AIResponseParser
                aiResponse = {
                    ...data.data,
                    role: "assistant",
                    timestamp: new Date()
                };
            } else {
                const { data } = await generateImage(payload);
                aiResponse = {
                    role: "assistant",
                    type: "image",
                    content: "Here's your generated image:",
                    imageUrl: data.data.imageUrl || data.data.image,
                    timestamp: new Date(),
                };
            }

            setMessages((prev) => [...prev, aiResponse]);
            // Refresh chats list to update the latest message and title
            await refreshChats();
            if (!selectedChat) await refreshChats(); // Ensure the first chat gets created and selected
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
            // Remove the user message if the request failed
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">

            {/* Header (Placeholder for the menu button/title) */}
            <div className={`border-b ${isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"} py-1.5 px-4 sm:py-3 shrink-0 z-20`}>
                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <h1 className="text-sm w-full sm:text-lg font-medium truncate sm:max-w-[70vw] mx-auto sm:mx-0">
                        {selectedChat?.title || "New Chat"}
                    </h1>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {mode === "text" ? "Text Mode" : "Image Mode"}
                    </span>
                </div>
            </div>

            {/* Chat messages area with proper scrolling */}
            <div className="flex-1 mb-28 sm:mb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                <div className="max-w-5xl mx-auto px-2 sm:px-6 py-4 sm:py-8 pb-4">
                    {messages.length === 0 && !loading ? (
                        <div className="flex flex-col items-center pt-20 sm:pt-40">
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
                                        {/* AI Avatar - Hidden on small screens for cleaner look */}
                                        {!isUser && (
                                            <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full mt-4 -mr-3 bg-linear-to-r from-purple-500 to-blue-500 items-center justify-center shrink-0">
                                                <Icon icon="hugeicons:developer" className="text-white text-xl" />
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div
                                            className={`
                                                p-2 sm:p-3 rounded-xl h-fit   ${isUser ? "rounded-br-md" : "rounded-tl-md"}
                                                ${messageBg} 
                                                max-w-full sm:max-w-[80%]
                                                ${isImageMessage ? "p-1 sm:p-2" : "text-sm sm:text-base"} 
                                            `}
                                        >
                                            {isImageMessage ? (
                                                <div className="grid sm:grid-cols-2 space-y-1">
                                                    {/* Show caption */}
                                                    {msg.content &&
                                                        typeof msg.content === "string" &&
                                                        !msg.content.includes("https://ik.imagekit.io") && (
                                                            <p className={`text-xs sm:text-sm px-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                                                {msg.content}
                                                            </p>
                                                        )}

                                                    <div className="relative group grid-cols-1 grid max-w-full">
                                                        <img
                                                            src={imageUrl!}
                                                            alt="AI Generated"
                                                            className=" max-w-full w-full h-auto transition-transform group-hover:scale-101 rounded-lg"
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
                                                    themeName={isDark ? "github" : "light"}
                                                />
                                            )}
                                        </div>

                                        {/* User Avatar - Hidden on small screens for cleaner look */}
                                        {isUser && (
                                            <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-600 uppercase items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {user?.name?.[0] || "U"}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Loading State */}
                            {loading && (
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-r from-purple-500 to-blue-500 items-center justify-center shrink-0">
                                        <Icon icon="hugeicons:developer" className="text-white text-xl" />
                                    </div>
                                    <div>
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