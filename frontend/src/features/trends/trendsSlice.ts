import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TrendItem {
    year: number;
    month: number;
    average_price: number;
    median_sqft: number;
    average_price_per_sqft: number;
    total_sales: number;

}

interface TrendsState {
    data: TrendItem[] | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: TrendsState = {
    data: null,
    status: "idle",
    error: null
}

export const fetchTrends = createAsyncThunk("trend/fetchTrends", async () => {
    const response = await fetch("http://localhost:8000/housing/trends");

    return response.json() as Promise<TrendItem[]>;
});

const trendsSlice = createSlice({
    name: "trends",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrends.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTrends.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchTrends.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching trends";
            });
    },
});

export default trendsSlice.reducer;