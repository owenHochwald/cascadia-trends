import { configureStore } from '@reduxjs/toolkit'
import summaryReducer from '../features/summary/summarySlice';
import trendsReducer from '../features/trends/trendsSlice';
import scatterReducer from '../features/scatter/scatterSlice';

export const store = configureStore({
    reducer: {
        summary: summaryReducer,
        trends: trendsReducer,
        scatter: scatterReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

