import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../thunks/authThunk";

interface AuthState {
    user: any | null;
    loading: boolean;
}

const initialState: AuthState = { user: null, loading: true };

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
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
            .addCase(loginUser.rejected, (state) => { state.user = null; state.loading = false; })

            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
            .addCase(registerUser.rejected, (state) => { state.user = null; state.loading = false; })

            .addCase(getCurrentUser.pending, (state) => { state.loading = true; })
            .addCase(getCurrentUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
            .addCase(getCurrentUser.rejected, (state) => { state.user = null; state.loading = false; })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
