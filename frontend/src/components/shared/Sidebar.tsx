// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { fromNow } from "miti-pariwartan";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";

import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { useAppContext } from "../../context/AppContext";

import {
    createChatThunk,
    deleteChatThunk,
    getChatsThunk,
} from "../../redux/thunks/chatThunk";

import Logo from "./Logo";
import { FronendRoutes } from "../../constant/FrontendRoutes";
import { logoutUser } from "../../redux/thunks/authThunk";
import { logout } from "../../redux/slices/authSlice";

const Sidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { chats, selectedChat, selectChat } = useChat();
    const { theme, setTheme, navigate } = useAppContext();

    const [searchTerm, setSearchTerm] = useState("");
    const [creatingChat, setCreatingChat] = useState(false);

    // ----------------------------
    // FILTER CHATS
    // ----------------------------
    const filteredChats = (chats || []).filter((chat: any) => {
        if (!chat) return false;
        const s = searchTerm.toLowerCase();
        const title = (chat.title || "New Chat").toLowerCase();
        const matchTitle = title.includes(s);

        const matchMsg =
            chat.messages?.some((m: any) =>
                m?.content?.toString().toLowerCase().includes(s)
            ) ?? false;

        return matchTitle || matchMsg;
    });

    // ----------------------------
    // CREATE NEW CHAT
    const handleNewChat = async () => {
        if (creatingChat || !user) return;
        setCreatingChat(true);

        try {
            const newChat = await dispatch(createChatThunk()).unwrap();

            // Refresh chats list in Redux
            await dispatch(getChatsThunk()).unwrap();

            selectChat(newChat);
            toast.success("New chat created!");
            navigate("/chat");
        } catch (err: any) {
            toast.error(err?.message || "Failed to create chat");
        } finally {
            setCreatingChat(false);
        }
    };


    // ----------------------------
    // DELETE CHAT
    // ----------------------------
    const handleDelete = async (e: any, chatId: string) => {
        e.stopPropagation();

        try {
            await dispatch(deleteChatThunk(chatId)).unwrap();
            toast.success("Chat deleted");

            const refreshed = await dispatch(getChatsThunk()).unwrap();
            const updatedChats = refreshed?.chats || refreshed || [];
            if (updatedChats.length > 0) {
                selectChat(updatedChats[0]);
                navigate("/chat");
            } else {
                selectChat(null);
                navigate("/");
            }
        } catch {
            toast.error("Failed to delete chat");
        }
    };

    // ----------------------------
    // LAST MESSAGE PREVIEW
    // ----------------------------
    const getPreview = (chat: any) => {
        const lastUserMsg = [...(chat?.messages || [])]
            .reverse()
            .find((m: any) => m.role === "user");

        const fallback = chat?.title || "New Chat";
        if (!lastUserMsg) return fallback;

        const c = lastUserMsg?.content;
        if (!c) return fallback;

        const isImage =
            lastUserMsg.type === "image" ||
            /\.(jpe?g|png|gif|webp)$/i.test(c.toString());

        if (isImage) return "Image sent";

        const text = c.toString();
        return text.length > 60 ? text.slice(0, 60) + "..." : text;
    };

    // ----------------------------
    // AUTO CREATE CHAT IF EMPTY
    // ----------------------------
    useEffect(() => {
        if (!user) return;

        const loadChats = async () => {
            const res = await dispatch(getChatsThunk()).unwrap();
            const list = res?.chats || res || [];

            if (list.length === 0) {
                const newChat = await dispatch(createChatThunk()).unwrap();
                selectChat(newChat);
                navigate("/chat");
                toast.success("New chat created automatically!");
            }
        };

        loadChats();
    }, [user]);

    // ----------------------------
    // RENDER
    // ----------------------------
    return (
        <div
            className={`h-screen flex flex-col px-3 py-5 border-r overflow-hidden transition-all ${theme === "dark"
                ? "border-white/10 bg-[#0f0f0f]"
                : "border-gray-200 bg-white"
                }`}
        >
            {/* Logo */}
            <div className="mb-4 px-1">
                <Logo />
            </div>

            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                disabled={creatingChat}
                className={`flex items-center justify-center w-full py-3 mb-4 rounded-sm font-semibold text-sm transition-colors ${creatingChat
                    ? "bg-gray-500 cursor-not-allowed text-white/70"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
            >
                {creatingChat ? (
                    <>
                        <Icon icon="eos-icons:loading" className="animate-spin mr-2" fontSize={20} />
                        Creating...
                    </>
                ) : (
                    <>
                        <Icon icon="ic:round-add" className="mr-2" fontSize={20} />
                        New Chat
                    </>
                )}
            </button>

            {/* Search Input */}
            <div
                className={`flex items-center gap-3 px-3 py-2 mb-4 rounded-sm transition-colors ${theme === "dark"
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <Icon
                    icon="material-symbols:search-rounded"
                    fontSize={20}
                    className={theme === "dark" ? "text-white/60" : "text-gray-500"}
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
                        fontSize={18}
                        onClick={() => setSearchTerm("")}
                        className={`cursor-pointer ${theme === "dark" ? "text-white/60" : "text-gray-500"
                            } hover:text-red-500`}
                    />
                )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
                {filteredChats.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 mt-10">
                        {searchTerm ? "No chats found" : "No chats yet"}
                    </p>
                ) : (
                    filteredChats.map((chat: any) => (
                        <div
                            key={chat._id}
                            onClick={() => {
                                selectChat(chat);
                                navigate("/chat");
                            }}
                            className={`group relative px-2 py-2 cursor-pointer transition-all border rounded-sm ${selectedChat?._id === chat._id
                                ? theme === "dark"
                                    ? "bg-white/10 border-purple-500"
                                    : "bg-gray-100 border-purple-500"
                                : theme === "dark"
                                    ? "border-white/10 hover:bg-white/5"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0 pr-8">
                                    <p
                                        className={`text-sm font-medium truncate ${selectedChat?._id === chat._id
                                            ? "text-purple-400"
                                            : theme === "dark"
                                                ? "text-white"
                                                : "text-gray-800"
                                            }`}
                                    >
                                        {getPreview(chat)}
                                    </p>

                                    <span className="text-xs text-gray-500">
                                        {fromNow(chat.updatedAt)}
                                    </span>
                                </div>

                                {/* Delete Icon */}
                                <Icon
                                    icon="material-symbols:delete-outline-rounded"
                                    fontSize={19}
                                    onClick={(e) => handleDelete(e, chat._id)}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${theme === "dark"
                                        ? "text-white/60 hover:text-red-400"
                                        : "text-gray-500 hover:text-red-600"
                                        }`}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Divider */}
            <div
                className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"
                    }`}
            />

            {/* Credits */}
            <div
                onClick={() => navigate(FronendRoutes.CREDITS)}
                className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer transition-colors border ${theme === "dark"
                    ? "hover:bg-white/5 border-white/10"
                    : "hover:bg-gray-100 border-gray-200"
                    }`}
            >
                <Icon
                    icon="lets-icons:dimond-alt-duotone"
                    fontSize={24}
                    className="text-purple-500"
                />
                <div>
                    <p
                        className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                    >
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

            {/* Theme Toggle */}
            <div
                className={`flex items-center justify-between p-3 mt-1 rounded-sm cursor-pointer transition-colors border ${theme === "dark"
                    ? "hover:bg-white/5 border-white/10"
                    : "hover:bg-gray-100 border-gray-200"
                    }`}
            >
                <div className="flex items-center gap-3 text-sm">
                    <Icon
                        icon={theme === "dark" ? "mdi:weather-sunny" : "mdi:weather-night"}
                        fontSize={20}
                        className={theme === "dark" ? "text-yellow-400" : "text-gray-700"}
                    />
                    <span
                        className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}
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

            {/* Profile + Logout */}
            <div
                className={`flex items-center justify-between p-3 mt-1 rounded-sm transition-colors border ${theme === "dark"
                    ? "hover:bg-white/5 border-white/10"
                    : "hover:bg-gray-100 border-gray-200"
                    }`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon
                        icon="mdi:account-circle"
                        fontSize={32}
                        className={theme === "dark" ? "text-white/80" : "text-gray-700"}
                    />

                    <div className="min-w-0">
                        <p
                            className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-800"
                                }`}
                        >
                            {user ? user.name || user.email.split("@")[0] : "Guest"}
                        </p>

                        <p
                            className={`text-xs truncate ${theme === "dark" ? "text-white/60" : "text-gray-600"
                                }`}
                        >
                            {user?.email || "Sign in to save chats"}
                        </p>
                    </div>
                </div>

                {user && (
                    <Icon
                        icon="mdi:logout"
                        fontSize={20}
                        onClick={async () => {
                            try {
                                await dispatch(logoutUser()).unwrap();
                                toast.success("Logged out");
                                navigate("/login");
                            } catch {
                                dispatch(logout());
                                navigate("/login");
                            }
                        }}
                        className={`cursor-pointer ${theme === "dark" ? "text-white/70 hover:text-red-400" : "text-gray-600 hover:text-red-600"
                            }`}
                    />
                )}
            </div>
        </div>
    );
};

export default Sidebar;
