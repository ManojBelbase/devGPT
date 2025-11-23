import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/login", data);

            // If backend returns error status but HTTP 200
            if (res.data.status === "error") {
                return rejectWithValue(res.data); // This will go to .rejected
            }

            return res.data;
        } catch (err: any) {
            // Network error or 4xx/5xx
            const errorData = err.response?.data || { message: "Network error" };
            return rejectWithValue(errorData);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: { name: string; email: string; password: string }) => {
        const res = await api.post("/user/register", data);
        return res.data; // return full response
    }
);

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
    const res = await api.get("/user/current");
    return res.data; // return full response
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    const res = await api.get("/user/logout");
    return res.data; // optional
});

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
