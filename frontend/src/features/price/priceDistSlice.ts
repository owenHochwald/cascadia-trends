import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PriceDistributionState {
    data: [number] | null,
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};
const initialState: PriceDistributionState = {
    data: null,
    status: "idle",
    error: null,
};

export const fetchPriceDistribution = createAsyncThunk(
    "priceDistribution/fetchPriceDistribution", async () => {
        const response = await fetch("http://localhost:8000/housing/price-distribution");
        return response.json() as Promise<[number]>;
    });

const priceDistributionSlice = createSlice({
    name: "priceDistribution",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPriceDistribution.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPriceDistribution.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchPriceDistribution.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching price distribution data";
            });
    },
});

export default priceDistributionSlice.reducer;