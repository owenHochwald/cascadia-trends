import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SizeDistributionState {
    data: [number] | null,
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};
const initialState: SizeDistributionState = {
    data: null,
    status: "idle",
    error: null,
};

export const fetchSizeDistribution = createAsyncThunk(
    "sizeDistribution/fetchSizeDistribution", async () => {
        const response = await fetch("http://localhost:8000/housing/size-distribution");
        return response.json() as Promise<[number]>;
    });

const sizeDistributionSlice = createSlice({
    name: "sizeDistribution",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSizeDistribution.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchSizeDistribution.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchSizeDistribution.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching size distribution data";
            });
    },
});

export default sizeDistributionSlice.reducer;

