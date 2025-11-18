import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const loginUser = createAsyncThunk("auth/login", async (data: { email: string; password: string }) => {
    const res = await api.post("/user/login", data);
    return res.data.data;
});

export const registerUser = createAsyncThunk("auth/register", async (data: { name: string; email: string; password: string }) => {
    const res = await api.post("/user/register", data);
    return res.data.data;
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
    const res = await api.get("/user/current");
    return res.data.data;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await api.get('/user/logout')
})


export const refreshToken = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/user/refresh");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);
