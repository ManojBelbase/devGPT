import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPlans } from "../../api/creditPlanApi";

export const getPlansThunk = createAsyncThunk(
    "plans/getPlans",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getPlans();
            return (data as any).data || data; // API format
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to load plans");
        }
    }
);
