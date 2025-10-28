// src/components/ChatBox.tsx
import { useEffect, useState, useRef } from "react"
import { Icon } from "@iconify/react"
import { useAppContext } from "../context/AppContext"
import { useChats } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import Logo from "./shared/Logo"
import Message from "./Message"
import Loader from "./Loader"
import toast from "react-hot-toast"
import { generateImage, generateText } from "../api/chatApi"

const ChatBox = () => {
    const { theme } = useAppContext()
    const { user } = useAuth()
    const { selectedChat, refreshChats } = useChats()

    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [mode, setMode] = useState<"text" | "image">("text")
    const endRef = useRef<HTMLDivElement>(null)

    // 1. Load messages when a chat is selected
    useEffect(() => {
        if (selectedChat?.messages) setMessages(selectedChat.messages)
        else setMessages([])
        setLoading(false)
    }, [selectedChat])

    // 2. Auto‑scroll to bottom
    const scroll = () => endRef.current?.scrollIntoView({ behavior: "smooth" })
    useEffect(() => scroll(), [messages])

    // 3. Submit → call correct API → update UI instantly
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim() || !user) return

        const userMsg = { role: "user", type: mode, content: prompt }

        // optimistic UI
        setMessages(p => [...p, userMsg])
        setPrompt("")
        setLoading(true)
        try {
            const payload = { prompt, chatId: selectedChat?._id }

            let aiMsg: any
            if (mode === "text") {
                const { data } = await generateText(payload)
                aiMsg = data.data
                refreshChats?.()
            } else {
                const { data } = await generateImage(payload)
                aiMsg = data.data
            }

            setMessages(p => [...p, aiMsg])

            if (!selectedChat) await refreshChats()
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Generation failed")
            setMessages(p => p.filter(m => m !== userMsg))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={`h-[90vh] flex flex-col mx-5 md:mx-10 mt-5 md:mt-10 xl:mx-30 2xl:pr-40 ${theme === "dark" ? "text-white" : "text-black"
                }`}
        >
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
                    </div>
                ) : (
                    <div className="space-y-3 pb-4">
                        {messages.map((m, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <Message message={m} />
                                {m.image && (
                                    <img
                                        src={m.image}
                                        alt={m.content}
                                        className="rounded-xl mt-1 max-w-full md:max-w-lg shadow"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                        <div ref={endRef} />
                        {loading && <Loader />}
                    </div>
                )}
            </div>

            {/* ---------- Input ---------- */}
            <form onSubmit={handleSubmit} className="w-full mt-2">
                <div
                    className={`flex items-center gap-3 px-4 py-2 border rounded-full transition-all ${theme === "dark"
                        ? "border-gray-700 bg-gray-900 focus-within:border-blue-500 focus-within:bg-gray-800"
                        : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:bg-gray-50"
                        }`}
                >
                    {/* mode selector */}
                    <div className="relative">
                        <select
                            value={mode}
                            onChange={e => setMode(e.target.value as any)}
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

                    <input
                        type="text"
                        placeholder={mode === "image" ? "Generate an image ..." : "Type your message ..."}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder-opacity-60 ${theme === "dark"
                            ? "text-white placeholder-gray-500"
                            : "text-black placeholder-gray-400"
                            }`}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={!prompt.trim() || loading}
                        className={`p-2 rounded-full transition-all ${prompt.trim() && !loading
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