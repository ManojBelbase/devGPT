
import { useEffect, useState, useRef } from "react"
import { Icon } from "@iconify/react"
import { useAppContext } from "../context/AppContext"
import { useChats } from "../context/ChatContext"
import Logo from "./shared/Logo"
import Message from "./Message"
import Loader from "./Loader"

const ChatBox = () => {
    const { theme } = useAppContext()
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [mode, setMode] = useState<"text" | "image">("text")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { selectedChat } = useChats()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages || [])
            setLoading(false)
        } else {
            setMessages([])
            setLoading(false)
        }
    }, [selectedChat])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return

        const newMessage = { role: "user", type: mode, content: prompt }
        setMessages((prev) => [...prev, newMessage])
        setPrompt("")
        setLoading(true)

        // Simulated response for demo
        setTimeout(() => {
            if (mode === "text") {
                // Text generation
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        type: "text",
                        content: `Generated response for: "${newMessage.content}"`,
                    },
                ])
            } else {
                // Image generation
                const fakeImage = "https://placehold.co/600x400?text=" + encodeURIComponent(prompt)
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        type: "image",
                        content: newMessage.content,
                        image: fakeImage,
                    },
                ])
            }
            setLoading(false)
        }, 1500)
    }

    return (
        <div
            className={`h-[90vh] flex flex-col mx-5 md:mx-10 mt-5 md:mt-10 xl:mx-30 2xl:pr-40 ${theme === "dark" ? "text-white" : "text-black"
                }`}
        >
            {/* Messages */}
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
                            <p
                                className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                                    }`}
                            >
                                Type your question or describe an image
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {messages.map((message: any, index: number) => (
                            <div key={index} className="flex flex-col gap-1">
                                <Message message={message} />
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt={message.content}
                                        className="rounded-xl mt-1 max-w-full md:max-w-lg shadow"
                                    />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {loading && <Loader />}
                    </div>
                )}
            </div>

            {/* Prompt Box */}
            <form onSubmit={handleSubmit} className="w-full mt-2">
                <div
                    className={`flex items-center gap-3 px-4 py-2 border rounded-full transition-all ${theme === "dark"
                        ? "border-gray-700 bg-gray-900 focus-within:border-blue-500 focus-within:bg-gray-800"
                        : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:bg-gray-50"
                        }`}
                >
                    {/* Dropdown: Text / Image */}
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

                    {/* Input field */}
                    <input
                        type="text"
                        placeholder={
                            mode === "image"
                                ? "Generate an image ..."
                                : "Type your message ..."
                        }
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder-opacity-60 ${theme === "dark"
                            ? "text-white placeholder-gray-500"
                            : "text-black placeholder-gray-400"
                            }`}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!prompt.trim()}
                        className={`p-2 rounded-full transition-all ${prompt.trim()
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
