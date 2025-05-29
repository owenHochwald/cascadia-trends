import { configureStore } from '@reduxjs/toolkit'
import summaryReducer from '../features/summary/summarySlice';
import trendsReducer from '../features/trends/trendsSlice';
import scatterReducer from '../features/scatter/scatterSlice';
import sizeReducer from '../features/size-distribtion/sizeSlice';
import priceReducer from '../features/price/priceDistSlice';
import bedroomReducer from '../features/bedrooms/bedroomSlice';

export const store = configureStore({
    reducer: {
        summary: summaryReducer,
        trends: trendsReducer,
        scatter: scatterReducer,
        sizeDist: sizeReducer,
        priceDist: priceReducer,
        bedrooms: bedroomReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

