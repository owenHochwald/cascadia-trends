import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Bedroom {
    small: number;
    medium: number;
    large: number;
    total: number;
}

interface BedroomState {
    data: Bedroom | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: BedroomState = {
    data: null,
    status: "idle",
    error: null,
};

export const fetchBedrooms = createAsyncThunk("bedrooms/fetchBedrooms", async () => {
    const response = await fetch("http://localhost:8000/housing/bedrooms");
    return response.json() as Promise<Bedroom>;
});

const bedroomSlice = createSlice({
    name: "bedrooms",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBedrooms.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchBedrooms.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchBedrooms.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching bedroom data";
            });
    },
});

export default bedroomSlice.reducer;