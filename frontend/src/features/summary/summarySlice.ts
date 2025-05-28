import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SummaryPoint {
    average_price: number
    median_sqft: number
    total_sales: number
}

interface SummaryState {
    data: SummaryPoint | null
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: SummaryState = {
    data: null,
    status: "idle",
    error: null,
}

export const fetchSummary = createAsyncThunk("summary/fetchSummary", async () => {
    const response = await fetch("http://localhost:8000/housing/summary")
    return response.json();
})

const summarySlice = createSlice({
    name: "summary",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummary.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action: PayloadAction<SummaryPoint>) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error";
            });
    },
});

export default summarySlice.reducer


