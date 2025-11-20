// src/components/ChatInput.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/AppContext";

// Define the props for the ChatInput component
interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    mode: "text" | "image";
    setMode: (mode: "text" | "image") => void;
    loading: boolean;
    handleSubmit: (e: React.FormEvent | React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
    prompt,
    setPrompt,
    mode,
    setMode,
    loading,
    handleSubmit,
    inputRef
}) => {
    const { theme } = useAppContext();
    const isDark = theme === "dark";

    return (
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
                        disabled={loading}
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
    );
};

export default ChatInput;