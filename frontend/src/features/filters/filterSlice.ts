import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterRange = [number, number];
export type DateRange = [string, string];

export interface FilterState {
    priceRange: FilterRange;
    sqftRange: FilterRange;
    bedroomCategory: string | null;
    dateRange: DateRange;
    // Track which chart initiated the filter
    sourceChart: string | null;
    // Selected point IDs for cross-filtering
    selectedPoints: string[];
    isFiltering: boolean;
}

const initialState: FilterState = {
    priceRange: [0, 2000000],
    sqftRange: [0, 10000],
    bedroomCategory: null,
    dateRange: ['2020-01', '2025-12'],
    sourceChart: null,
    selectedPoints: [],
    isFiltering: false
};

export interface UpdateFilterPayload {
    priceRange?: FilterRange;
    sqftRange?: FilterRange;
    bedroomCategory?: string | null;
    dateRange?: DateRange;
    sourceChart: string;
    selectedPoints?: string[];
}

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        updateFilters: (state, action: PayloadAction<UpdateFilterPayload>) => {
            const { sourceChart, ...filters } = action.payload;
            state.sourceChart = sourceChart;
            state.isFiltering = true;
            
            // Update only the provided filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    (state as any)[key] = value;
                }
            });
        },
        clearFilters: (state) => {
            return { ...initialState, isFiltering: false };
        },
        clearSourceChart: (state) => {
            state.sourceChart = null;
        }
    }
});

export const { updateFilters, clearFilters, clearSourceChart } = filterSlice.actions;
export default filterSlice.reducer;
