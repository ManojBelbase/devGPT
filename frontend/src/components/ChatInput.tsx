// src/components/ChatInput.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/AppContext";
import TextareaAutosize from 'react-textarea-autosize';

// Define the props for the ChatInput component
interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    mode: "text" | "image";
    setMode: (mode: "text" | "image") => void;
    loading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
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

    // Function to handle keydown events: Enter sends, Shift + Enter creates a new line
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const toggleMode = () => {
        setMode(mode === "text" ? "image" : "text");
    };

    return (
        // Make the container fixed at the bottom for mobile experience
        <div className={`
            fixed sm:relative bottom-0 left-0 right-0 
            shadow-2xl z-20 
            mx-auto w-full
        `}>
            <div className="max-w-4xl mx-auto px-2 sm:px-6 md:px-8 py-3 w-full">
                <div className="relative mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className={`
                            flex items-end p-2 
                            border ${isDark ? "border-gray-700" : "border-gray-300"} 
                            rounded-2xl shadow-md sm:rounded-3xl sm:shadow-lg
                            ${isDark ? "bg-gray-900" : "bg-white"}
                            transition-all
                        `}
                    >
                        {/* Attachment/Mode Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleMode}
                            disabled={loading}
                            title={mode === "text" ? "Switch to Image Mode" : "Switch to Text Mode"}
                            className={`
                                p-1.5 sm:p-2 rounded-xl sm:rounded-full 
                                transition-colors duration-200 
                                text-gray-500 dark:text-gray-400
                                ${!loading ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "cursor-not-allowed"}
                                flex items-center justify-center
                            `}
                        >
                            <Icon
                                icon={mode === "text" ? "material-symbols:attach-file" : "material-symbols:palette-outline"}
                                fontSize={20}
                                className="sm:text-2xl"
                            />
                        </button>

                        {/* Multi-line Textarea */}
                        <TextareaAutosize
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            placeholder={mode === "image" ? "Describe the image to generate..." : "Send a message..."}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            minRows={1} // Ensures it looks like a single line when empty
                            maxRows={6} // Limits vertical growth on mobile
                            className={`
                                flex-1 w-full max-h-40 resize-none overflow-y-auto 
                                bg-transparent outline-none p-2
                                text-sm sm:text-base 
                                ${isDark ? "text-white" : "text-black"}
                                transition-all
                            `}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!prompt.trim() || loading}
                            className={`
                                p-2 sm:p-3 rounded-xl sm:rounded-full 
                                transition-all duration-200 
                                ${prompt.trim() && !loading
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                }
                                ml-1 sm:ml-2
                                flex items-center justify-center
                            `}
                        >
                            <Icon icon="material-symbols:send-rounded" fontSize={20} className="sm:text-2xl" />
                        </button>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 mb-1">
                    devGPT can make mistakes. Think carefully.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;