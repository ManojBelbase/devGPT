import { createSlice } from "@reduxjs/toolkit";
import {
    getCurrentUser,
    googleLogin,
    loginUser,
    logoutUser,
    registerUser
} from "../thunks/authThunk";

interface AuthState {
    user: any | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder

            // ---------------- LOGIN ----------------
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // backend returns { status, message, data }
                state.user = action.payload.data ?? null;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })

            // ---------------- REGISTER ----------------
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.data ?? null;
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })

            // ---------------- GET CURRENT USER ----------------
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload.data ?? null;
                state.loading = false;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })

            // Inside extraReducers builder, add this block (anywhere with the others):

            // ---------------- GOOGLE LOGIN ----------------
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.user = action.payload.data ?? null;
                state.loading = false;
            })
            .addCase(googleLogin.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })

            // ---------------- LOGOUT ----------------
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
