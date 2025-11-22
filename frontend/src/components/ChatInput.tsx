// src/components/ChatInput.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/AppContext";

// Import necessary utility to handle textarea height
import TextareaAutosize from 'react-textarea-autosize';

// Define the props for the ChatInput component
interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    mode: "text" | "image";
    setMode: (mode: "text" | "image") => void;
    loading: boolean;
    // Update handleSubmit to accept form event (best practice for form submission)
    handleSubmit: (e: React.FormEvent) => void;
    // We'll change this to a RefObject<HTMLTextAreaElement> for multi-line support
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

    // Function to handle keydown events, including Shift + Enter for new line
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // Use e.currentTarget.form to get the form element and submit it
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const toggleMode = () => {
        setMode(mode === "text" ? "image" : "text");
    };

    return (
        <div className=" border-gray-200 dark:border-gray-800  z-10 -mt-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 w-full ">
                <div className="relative mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className={`
                            flex items-end p-2 
                            border ${isDark ? "border-gray-700" : "border-gray-300"} 
                            rounded-3xl shadow-lg 
                            ${isDark ? "bg-gray-900" : "bg-white"}
                            transition-all
                        `}
                    >
                        {/* Attachment/Image Icon (Replaces the <select>) */}
                        {/* We use the "clip" icon to represent attachment/image upload */}
                        <button
                            type="button"
                            onClick={toggleMode}
                            disabled={loading}
                            title={mode === "text" ? "Switch to Image Mode" : "Switch to Text Mode"}
                            className={`
                                p-2 rounded-full 
                                transition-colors duration-200 
                                text-gray-500 dark:text-gray-400
                                ${!loading ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "cursor-not-allowed"}
                            `}
                        >
                            <Icon icon="material-symbols:attach-file" fontSize={24} />
                        </button>

                        {/* Multi-line Textarea (Replaces the <input>) */}
                        <TextareaAutosize
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            placeholder={mode === "image" ? "Describe the image or ask about it..." : "Send a message..."}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            maxRows={8}
                            className={`
                                flex-1 w-full max-h-48 resize-none overflow-y-auto 
                                bg-transparent outline-none p-2
                                text-base 
                                ${isDark ? "text-white" : "text-black"}
                                transition-all
                            `}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!prompt.trim() || loading}
                            className={`
                                p-3 rounded-full 
                                transition-all duration-200 
                                ${prompt.trim() && !loading
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                }
                                ml-2
                            `}
                        >
                            <Icon icon="material-symbols:send-rounded" fontSize={24} />
                        </button>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    devGPT can make mistakes. Think carefully.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;