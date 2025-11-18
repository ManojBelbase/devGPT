// src/redux/thunks/chatThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChats, createChat } from "../../api/chatApi";

export const getChatsThunk = createAsyncThunk("chat/getChats", async (_, { rejectWithValue }) => {
    try {
        const { data } = await getChats();
        return (data as any).data || data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Failed to load chats");
    }
});

export const createChatThunk = createAsyncThunk("chat/createChat", async (_, { rejectWithValue }) => {
    try {
        const { data } = await createChat();
        return data; // { chat: newChat }
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message);
    }
});