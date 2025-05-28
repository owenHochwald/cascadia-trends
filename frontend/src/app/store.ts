import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice';
import summaryReducer from '../features/summary/summarySlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        summary: summaryReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

