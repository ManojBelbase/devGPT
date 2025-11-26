import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import planReducer from './slices/planSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        plan: planReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
