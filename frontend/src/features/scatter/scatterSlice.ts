import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ScatterPoint {
    price: number;
    bedroom_category: string;
    sqft_living: number;
}

interface ScatterState {
    data: ScatterPoint[] | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ScatterState = {
    data: null,
    status: "idle",
    error: null,
}

export const fetchScatter = createAsyncThunk("scatter/fetchScatter", async () => {
    const response = await fetch("http://localhost:8000/housing/scatter");
    return response.json() as Promise<ScatterPoint[]>;
});

const scatterSlice = createSlice({
    name: "scatter",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScatter.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchScatter.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchScatter.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching scatter data";
            });
    },
});

export default scatterSlice.reducer;

