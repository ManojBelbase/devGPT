// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import moment from "moment";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import {
    createChat,
    deleteChat as apiDeleteChat,
} from "../../api/chatApi";
import Logo from "./Logo";
import { FronendRoutes } from "../../constant/FrontendRoutes";
import type { Chat, Message } from "../../types/types";

const Sidebar = () => {
    const { theme, setTheme, navigate } = useAppContext();
    const {
        chats,
        selectedChat,
        setSelectedChat,
        setChats,
        refreshChats,
    } = useChats();
    const { user, logout } = useAuth();

    const [searchTerm, setSearchTerm] = useState("");
    const [creatingChat, setCreatingChat] = useState(false);

    // 1. FILTER CHATS (search)
    const filteredChats = chats.filter((chat) => {
        const title = (chat.title || "").toLowerCase();
        const messages = chat.messages || [];
        const inTitle = title.includes(searchTerm.toLowerCase());
        const inMessages = messages.some(
            (msg: Message) =>
                (msg.content || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
        return inTitle || inMessages;
    });

    const handleNewChat = async () => {
        if (creatingChat || !user) return;
        setCreatingChat(true);

        try {
            await createChat();
            refreshChats?.();
            toast.success("New chat created");
        } catch (err: any) {
            console.error("createChat error:", err);
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Failed to create chat"
            );
        } finally {
            setCreatingChat(false);
        }
    };

    // 3. DELETE CHAT – INSTANT UI UPDATE
    const handleDelete = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        if (!window.confirm("Delete this chat permanently?")) return;

        try {
            await apiDeleteChat({ chatId });
            toast.success("Chat deleted");
            // Update local state instantly
            refreshChats?.();
        } catch (err: any) {
            console.error("deleteChat error:", err);
            toast.error(
                err.response?.data?.message || "Failed to delete chat"
            );
        }
    };

    // 4. PREVIEW (title / last user message)
    const getPreview = (chat: Chat) => {
        const lastUserMsg = [...(chat.messages || [])]
            .reverse()
            .find((m) => m.role === "user");

        if (!lastUserMsg) return chat.title || "New Chat";

        const content = lastUserMsg.content ?? "";
        const isImage =
            lastUserMsg.type === "image" ||
            (typeof content === "string" && /\.(jpe?g|png|gif)$/i.test(content));

        if (isImage) return "Image sent";
        return typeof content === "string"
            ? content.slice(0, 60) + (content.length > 60 ? "..." : "")
            : "Message";
    };

    // -----------------------------------------------------------------
    // 5. AUTO-TITLE AFTER FIRST USER MESSAGE (instant)
    // -----------------------------------------------------------------
    useEffect(() => {
        if (!selectedChat) return;

        const firstUserMsg = selectedChat.messages.find(
            (m: any) => m.role === "user"
        );
        const alreadyHasTitle = selectedChat.title !== "New Chat";

        if (!firstUserMsg || alreadyHasTitle) return;

        const generateTitle = () => {
            if (firstUserMsg.type === "image") return "Generated Image";
            const txt = (firstUserMsg.content ?? "").toString();
            return txt.length > 60 ? txt.slice(0, 60) + "..." : txt;
        };

        const newTitle = generateTitle();

        // Update BOTH the global list AND the selected reference
        setChats((prev) =>
            prev.map((c) =>
                c._id === selectedChat._id ? { ...c, title: newTitle } : c
            )
        );
        setSelectedChat((prev: any) =>
            prev ? { ...prev, title: newTitle } : null
        );
        // Dependency array includes _id to avoid stale closure issues
    }, [selectedChat?.messages, selectedChat?._id]);

    // 6. INITIAL LOAD (optional – keep if you want auto-refresh on focus)
    useEffect(() => {
        refreshChats?.();
    }, []);

    // RENDER
    return (
        <div
            className={`h-screen flex flex-col px-2 py-4 border-r overflow-hidden ${theme === "dark"
                ? "border-white/10 bg-[#121212]"
                : "border-gray-200 bg-white"
                }`}
        >
            {/* Logo */}
            <div className="px-3 mb-4">
                <Logo />
            </div>

            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                disabled={creatingChat}
                className={`flex items-center justify-center w-full py-2.5 mb-4 rounded-md font-medium text-sm transition-all ${creatingChat
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-linear-to-r from-[#a456f7] to-[#3d81f6] hover:from-[#a456f7]/90 hover:to-[#3d81f6]/90 text-white"
                    }`}
            >
                {creatingChat ? (
                    <>
                        <Icon
                            icon="eos-icons:loading"
                            className="animate-spin mr-2"
                            fontSize={18}
                        />
                        Creating...
                    </>
                ) : (
                    <>
                        <span className="mr-2 text-lg">+</span>
                        New Chat
                    </>
                )}
            </button>

            {/* Search */}
            <div
                className={`flex items-center gap-2 px-3 py-2.5 mb-4 border rounded-md ${theme === "dark"
                    ? "border-white/20 bg-white/5"
                    : "border-gray-300 bg-gray-50"
                    }`}
            >
                <Icon
                    icon="material-symbols:search"
                    fontSize={20}
                    className={theme === "dark" ? "text-white/70" : "text-gray-600"}
                />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm ${theme === "dark"
                        ? "text-white placeholder-white/50"
                        : "text-gray-800 placeholder-gray-500"
                        }`}
                />
                {searchTerm && (
                    <Icon
                        icon="material-symbols:close"
                        fontSize={20}
                        onClick={() => setSearchTerm("")}
                        className={`cursor-pointer ${theme === "dark" ? "text-white/70" : "text-gray-600"
                            }`}
                    />
                )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-1 space-y-2">
                {filteredChats.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 mt-8">
                        {searchTerm ? "No chats found" : "No chats yet"}
                    </p>
                ) : (
                    filteredChats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => setSelectedChat(chat)}
                            className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-all border ${selectedChat?._id === chat._id
                                ? theme === "dark"
                                    ? "border-white/30 bg-white/10"
                                    : "border-gray-400 bg-gray-100"
                                : theme === "dark"
                                    ? "border-gray-700 hover:border-white/20 hover:bg-white/5"
                                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                >
                                    {getPreview(chat)}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {moment(chat.updatedAt).fromNow()}
                                </span>
                            </div>

                            <Icon
                                icon="material-symbols:delete-outline"
                                fontSize={18}
                                onClick={(e) => handleDelete(e, chat._id)}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${theme === "dark"
                                    ? "text-white/70 hover:text-red-400"
                                    : "text-gray-600 hover:text-red-600"
                                    }`}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Credits */}
            <div
                onClick={() => navigate(FronendRoutes.CREDITS)}
                className={`flex items-center gap-2 p-3 mt-4 rounded-md border cursor-pointer transition-all hover:scale-[1.01] ${theme === "dark" ? "border-white/15" : "border-gray-300"
                    }`}
            >
                <Icon
                    icon="lets-icons:dimond-alt-duotone"
                    className={theme === "dark" ? "text-white" : "text-gray-800"}
                />
                <div className="text-sm">
                    <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
                        Credits: <strong>{user?.credits ?? 0}</strong>
                    </p>
                    <span
                        className={`text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"
                            }`}
                    >
                        Buy more to keep generating
                    </span>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div
                className={`flex items-center justify-between p-3 mt-2 rounded-md border cursor-pointer transition-all hover:scale-[1.01] ${theme === "dark" ? "border-white/15" : "border-gray-300"
                    }`}
            >
                <div className="flex items-center gap-2 text-sm">
                    <Icon
                        icon={theme === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"}
                        className={theme === "dark" ? "text-white" : "text-gray-800"}
                    />
                    <span
                        className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                    >
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    />
                    <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition">
                        <div
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${theme === "dark" ? "translate-x-4" : ""
                                }`}
                        />
                    </div>
                </label>
            </div>

            {/* User / Logout */}
            <div
                className={`flex items-center gap-3 p-3 mt-2 rounded-md border cursor-pointer transition-all hover:scale-[1.01] ${theme === "dark" ? "border-white/15" : "border-gray-300"
                    }`}
                onClick={() => (user ? logout() : navigate(FronendRoutes.LOGIN))}
            >
                <Icon
                    icon="mdi:account-circle"
                    fontSize={28}
                    className={theme === "dark" ? "text-white" : "text-gray-800"}
                />
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                    >
                        {user ? user.name : "Sign in"}
                    </p>
                </div>
                {user && (
                    <Icon
                        icon="mdi:logout"
                        fontSize={20}
                        className={theme === "dark" ? "text-white/70" : "text-gray-600"}
                    />
                )}
            </div>
        </div>
    );
};

export default Sidebar;