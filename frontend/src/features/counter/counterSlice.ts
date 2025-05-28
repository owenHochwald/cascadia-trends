import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRandomNumber = createAsyncThunk(
  'counter/fetchRandomNumber',
  async () => {
    const res = await fetch('https://www.randomnumberapi.com/api/v1.0/random?min=1&max=100&count=1');
    const data = await res.json();
    return data[0];
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status: 'idle',
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomNumber.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRandomNumber.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      })
      .addCase(fetchRandomNumber.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment, decrement, reset } = counterSlice.actions;

export default counterSlice.reducer;
