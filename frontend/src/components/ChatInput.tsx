import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../context/AppContext";
import TextareaAutosize from "react-textarea-autosize";

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="fixed sm:relative bottom-0 left-0 right-0 z-20 w-full px-2 py-2">
            <div className="max-w-4xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className={`
                        flex items-end gap-3
                        rounded-2xl w-full
                        sm:px-4 px-2 py-2 sm:py-3
                        border
                        ${isDark
                            ? "bg-[#0f0f0f] border-[#2A2A2A]"
                            : "bg-white border-gray-300"
                        }
                        shadow-[0_0_15px_rgba(0,0,0,0.2)]
                        transition-all duration-200
                    `}
                >
                    {/* Left Action Button */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setMode(mode === "text" ? "image" : "text")}
                        className={`
                            p-2 rounded-xl
                            text-gray-400 
                            ${!loading ? "hover:bg-gray-800" : "opacity-40 cursor-not-allowed"}
                            transition
                        `}
                    >
                        <Icon
                            icon={
                                mode === "text"
                                    ? "solar:paperclip-linear"
                                    : "solar:palette-linear"
                            }
                            className="text-xl"
                        />
                    </button>

                    {/* Textarea */}
                    <TextareaAutosize
                        ref={inputRef}
                        minRows={1}
                        maxRows={8}
                        placeholder={mode === "text" ? "Type your message..." : "Describe the image you want..."}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        className={`
                            flex-1 resize-none outline-none text-sm -pt-4  pb-1
                            sm:text-[15px] leading-relaxed
                            ${isDark ? "text-gray-200 placeholder-gray-500" : "text-black"
                            }
                        `}
                    />

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || loading}
                        className={`
                            p-2 rounded-xl transition-all
                            ${prompt.trim()
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }
                        `}
                    >
                        <Icon icon="carbon:send-alt" className="text-xl" />
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-2">
                    devGPT can make mistakes. Think carefully.
                </p>

            </div>
        </div>
    );
};

export default ChatInput;
