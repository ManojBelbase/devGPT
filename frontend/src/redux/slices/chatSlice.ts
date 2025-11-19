// src/redux/slices/chatSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getChatsThunk } from "../thunks/chatThunk";

interface Chat {
    _id: string;
    messages: any[];
    createdAt?: string;
    // add more fields if needed
    title: string
}

interface ChatState {
    chats: Chat[];
    selectedChat: Chat | null;
    loading: boolean;
}

const initialState: ChatState = {
    chats: [],
    selectedChat: null,
    loading: false,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
            state.selectedChat = action.payload;
        },
        clearChats: (state) => {
            state.chats = [];
            state.selectedChat = null;
        },
        // Optional: optimistic add new chat
        addChatLocally: (state, action: PayloadAction<Chat>) => {
            state.chats.unshift(action.payload);
            state.selectedChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getChatsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(getChatsThunk.rejected, (state) => {
                state.loading = false;
                state.chats = [];
            })


    },
});

export const { setSelectedChat, clearChats, addChatLocally } = chatSlice.actions;


export default chatSlice.reducer;