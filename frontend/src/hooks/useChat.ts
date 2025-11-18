// src/hooks/useChat.ts
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { getChatsThunk } from "../redux/thunks/chatThunk";
import { setSelectedChat } from "../redux/slices/chatSlice";


export const useChat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { chats, selectedChat, loading } = useSelector((state: RootState) => state.chat);

    const refreshChats = () => dispatch(getChatsThunk());

    const selectChat = (chat: any) => dispatch(setSelectedChat(chat));

    return {
        chats,
        selectedChat,
        loading,
        refreshChats,
        selectChat,
        setSelectedChat: (chat: any) => dispatch(setSelectedChat(chat)),
    };
};