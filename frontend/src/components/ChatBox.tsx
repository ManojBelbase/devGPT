"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useAppContext } from "../context/AppContext"
import Logo from "./shared/Logo"
import { Icon } from "@iconify/react"
import Message from "./Message"

const ChatBox = () => {
    const { selectedChat, theme } = useAppContext()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Sync messages with selectedChat
    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages || [])
            setLoading(false)
        } else {
            setMessages([])
            setLoading(false)
        }
    }, [selectedChat])

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

    }

    return (
        <div
            className={`h-[90vh] flex flex-col mx-5 md:mx-10 mt-5 md:mt-10 xl:mx-30 2xl:pr-40 ${theme === "dark" ? "text-white" : "text-black"
                }`}
        >
            {/* Chat Messages Container */}
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
                        {!selectedChat && (
                            <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                Start a new conversation to begin
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2 pb-4">
                        {messages.map((message: any, index: number) => (
                            <Message key={index} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                        {/* Theree dots loading */}
                        {loading && <div className="">
                            <div className="loader flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce">
                                </div>
                            </div>
                        </div>}

                    </div>
                )}
            </div>

            {/* Prompt Input Box */}
            <form onSubmit={handleSubmit} className="w-full  mt-2">
                <div
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${theme === "dark"
                        ? "border-gray-700 bg-gray-900 focus-within:border-blue-500 focus-within:bg-gray-800"
                        : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:bg-gray-50"
                        }`}
                >
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder-opacity-60 ${theme === "dark" ? "text-white placeholder-gray-500" : "text-black placeholder-gray-400"
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`p-2 rounded-md transition-all ${input.trim()
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
    )
}

export default ChatBox
