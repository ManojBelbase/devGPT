import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getPlansThunk } from "../thunks/planThunk";

interface Plan {
    _id: string;
    name: string;
    price: number;
    credits: number;
    features?: string[];
    icon?: string;
}

interface PlanState {
    plans: Plan[];
    selectedPlan: Plan | null;
    loading: boolean;
}

const initialState: PlanState = {
    plans: [],
    selectedPlan: null,
    loading: false,
};

const planSlice = createSlice({
    name: "plan",
    initialState,
    reducers: {
        setSelectedPlan: (state, action: PayloadAction<Plan | null>) => {
            state.selectedPlan = action.payload;
        },
        clearPlans: (state) => {
            state.plans = [];
            state.selectedPlan = null;
        },
        addPlanLocally: (state, action: PayloadAction<Plan>) => {
            state.plans.unshift(action.payload);
            state.selectedPlan = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getPlansThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPlansThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(getPlansThunk.rejected, (state) => {
                state.loading = false;
                state.plans = [];
            });
    },
});

export const { setSelectedPlan, clearPlans, addPlanLocally } = planSlice.actions;

export default planSlice.reducer;
