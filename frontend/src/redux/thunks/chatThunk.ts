// src/redux/thunks/chatThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChats, createChat, deleteChat } from "../../api/chatApi";

export const getChatsThunk = createAsyncThunk("chat/getChats", async (_, { rejectWithValue }) => {
    try {
        const { data } = await getChats();
        return (data as any).data || data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Failed to load chats");
    }
});

export const createChatThunk = createAsyncThunk(
    "chat/createChat",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await createChat();
            return data.chat || data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to create chat");
        }
    }
);

// src/redux/thunks/chatThunk.ts
export const deleteChatThunk = createAsyncThunk(
    "chat/deleteChat",
    async (chatId: string, { rejectWithValue }) => {
        try {
            await deleteChat({ chatId });
            return chatId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete chat");
        }
    }
);