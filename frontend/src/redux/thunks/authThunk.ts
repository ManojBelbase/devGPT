import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";


export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async ({ token }: { token: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/google", { token });

            if (res.data?.data?.accessToken) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Google login failed" });
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/login", data);

            // If backend returns error message while still HTTP 200
            if (res.data.status === "error") {
                return rejectWithValue(res.data);
            }

            // Store access token
            if (res.data?.data?.accessToken) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
            }

            return res.data;
        } catch (err: any) {
            const errorData = err.response?.data || { message: "Network error" };
            return rejectWithValue(errorData);
        }
    }
);


export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/register", data);

            if (res.data?.data?.accessToken) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);


export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
    const res = await api.get("/user/current");
    return res.data;
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

            // Save new access token from backend
            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

