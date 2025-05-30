import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateFilters, clearFilters, type FilterRange } from './filterSlice';

const inputStyles = {
    base: "w-full bg-gray-800 rounded-lg px-4 py-2.5 text-sm border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 hover:border-gray-600 outline-none",
    active: "border-indigo-500 ring-1 ring-indigo-500",
    label: "block text-sm font-medium mb-2 text-gray-300",
    section: "transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={inputStyles.section}>
        <label className={inputStyles.label}>{title}</label>
        {children}
    </div>
);

const FilterPanel = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(state => state.filters);

    const formatPrice = (price: number) => 
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);

    const updatePriceRange = useCallback((range: FilterRange) => {
        dispatch(updateFilters({
            priceRange: range,
            sourceChart: 'filter-panel'
        }));
    }, [dispatch]);

    const updateSqftRange = useCallback((range: FilterRange) => {
        dispatch(updateFilters({
            sqftRange: range,
            sourceChart: 'filter-panel'
        }));
    }, [dispatch]);

    const updateBedroomCategory = useCallback((category: string) => {
        dispatch(updateFilters({
            bedroomCategory: category === 'all' ? null : category,
            sourceChart: 'filter-panel'
        }));
    }, [dispatch]);

    const updateDateRange = useCallback((range: [string, string]) => {
        dispatch(updateFilters({
            dateRange: range,
            sourceChart: 'filter-panel'
        }));
    }, [dispatch]);

    return (
        <div className="bg-gray-900 p-6 rounded-2xl text-white h-full transition-transform duration-300 ease-in-out transform hover:scale-[1.01]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                {filters.isFiltering && (
                    <div className="text-xs text-gray-400 animate-pulse">
                        Filters active
                    </div>
                )}
            </div>
            
            <div className="space-y-6">
                <FilterSection title="Price Range">
                    <div className="space-y-4">
                        <div>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                step="10000"
                                value={filters.priceRange[0]}
                                onChange={(e) => updatePriceRange([Number(e.target.value), filters.priceRange[1]])}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-sm text-gray-400 mt-1">
                                Min: {formatPrice(filters.priceRange[0])}
                            </div>
                        </div>
                        <div>
                            <input
                                type="range"
                                min={filters.priceRange[0]}
                                max="2000000"
                                step="10000"
                                value={filters.priceRange[1]}
                                onChange={(e) => updatePriceRange([filters.priceRange[0], Number(e.target.value)])}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-sm text-gray-400 mt-1">
                                Max: {formatPrice(filters.priceRange[1])}
                            </div>
                        </div>
                    </div>
                </FilterSection>

                <FilterSection title="Square Footage">
                    <div className="space-y-4">
                        <div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={filters.sqftRange[0]}
                                onChange={(e) => updateSqftRange([Number(e.target.value), filters.sqftRange[1]])}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-sm text-gray-400 mt-1">
                                Min: {filters.sqftRange[0]} sqft
                            </div>
                        </div>
                        <div>
                            <input
                                type="range"
                                min={filters.sqftRange[0]}
                                max="10000"
                                step="100"
                                value={filters.sqftRange[1]}
                                onChange={(e) => updateSqftRange([filters.sqftRange[0], Number(e.target.value)])}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-sm text-gray-400 mt-1">
                                Max: {filters.sqftRange[1]} sqft
                            </div>
                        </div>
                    </div>
                </FilterSection>

                <FilterSection title="Bedroom Category">
                    <div className="grid grid-cols-3 gap-2">
                        {['all', 'small', 'medium', 'large'].map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                                    ${(category === 'all' && !filters.bedroomCategory) || 
                                      filters.bedroomCategory === category
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                onClick={() => updateBedroomCategory(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title="Date Range">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="month"
                            value={filters.dateRange[0]}
                            onChange={(e) => updateDateRange([e.target.value, filters.dateRange[1]])}
                            className={inputStyles.base}
                        />
                        <input
                            type="month"
                            value={filters.dateRange[1]}
                            onChange={(e) => updateDateRange([filters.dateRange[0], e.target.value])}
                            className={inputStyles.base}
                        />
                    </div>
                </FilterSection>

                <div className="space-y-3 pt-4">
                    {filters.isFiltering && (
                        <button 
                            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => dispatch(clearFilters())}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
