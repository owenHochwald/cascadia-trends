import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useEffect, useState, useCallback } from "react";
import { fetchScatter } from "./scatterSlice";
import { useCrossFiltering, useFilteredData } from "../../app/hooks";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceArea,
} from "recharts";

const COLORS = {
    small: "#F59E0B",
    medium: "#10B981",
    large: "#8B5CF6"
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

interface SelectionState {
    startX: number | null;
    startY: number | null;
    endX: number | null;
    endY: number | null;
    isSelecting: boolean;
}

interface ScatterPoint {
    price: number;
    bedroom_category: string;
    sqft_living: number;
}

const ScatterChartComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.scatter);
    const [selection, setSelection] = useState<SelectionState>({
        startX: null,
        startY: null,
        endX: null,
        endY: null,
        isSelecting: false
    });

    const { filters, updateChartFilters, clearAllFilters } = useCrossFiltering('scatter-chart');
    
    // Apply filters to data
    const filteredData = useFilteredData('scatter-chart', data, (item, filters) => {
        if (filters.bedroomCategory && item.bedroom_category !== filters.bedroomCategory) return false;
        if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) return false;
        if (item.sqft_living < filters.sqftRange[0] || item.sqft_living > filters.sqftRange[1]) return false;
        return true;
    });

    useEffect(() => {
        if (status === "idle") dispatch(fetchScatter());
    }, [dispatch, status]);

    const handleMouseDown = useCallback((e: any) => {
        if (!e) return;
        const { xValue, yValue } = e;
        setSelection({
            startX: xValue,
            startY: yValue,
            endX: xValue,
            endY: yValue,
            isSelecting: true
        });
    }, []);

    const handleMouseMove = useCallback((e: any) => {
        if (!selection.isSelecting || !e) return;
        const { xValue, yValue } = e;
        setSelection(prev => ({
            ...prev,
            endX: xValue,
            endY: yValue
        }));
    }, [selection.isSelecting]);

    const handleMouseUp = useCallback(() => {
        if (!selection.isSelecting) return;

        // Calculate the selection bounds
        const minX = Math.min(selection.startX!, selection.endX!);
        const maxX = Math.max(selection.startX!, selection.endX!);
        const minY = Math.min(selection.startY!, selection.endY!);
        const maxY = Math.max(selection.startY!, selection.endY!);

        // Update filters
        updateChartFilters({
            sqftRange: [minX, maxX],
            priceRange: [minY, maxY]
        });

        setSelection({
            startX: null,
            startY: null,
            endX: null,
            endY: null,
            isSelecting: false
        });
    }, [selection, updateChartFilters]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">Loading scatter chart...</div>
            </div>
        );
    }
    
    if (status === "failed") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!filteredData) return null;

    // Group data by bedroom_category
    const groupedData = filteredData.reduce<Record<string, ScatterPoint[]>>((acc, item) => {
        if (!acc[item.bedroom_category]) {
            acc[item.bedroom_category] = [];
        }
        acc[item.bedroom_category].push(item);
        return acc;
    }, {});

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">Price vs Size by Category</h2>
                {filters.isFiltering && filters.sourceChart === 'scatter-chart' && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">
                            Selection Active
                        </span>
                        <button
                            onClick={clearAllFilters}
                            className="px-3 py-1 text-sm bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>
            
            <div className="h-[300px] relative group">
                {/* Selection instructions overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                        Drag to select an area
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            type="number"
                            dataKey="sqft_living"
                            name="Square Feet"
                            tick={{ fill: '#9CA3AF' }}
                            stroke="#4B5563"
                            label={{
                                value: 'Square Feet',
                                position: 'insideBottom',
                                offset: -10,
                                fill: '#9CA3AF'
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey="price"
                            name="Price"
                            tick={{ fill: '#9CA3AF' }}
                            stroke="#4B5563"
                            label={{
                                value: 'Price',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#9CA3AF'
                            }}
                            tickFormatter={(value) => `${formatCurrency(value)}`}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                borderColor: '#374151',
                                color: '#F9FAFB'
                            }}
                            formatter={(value: number, name: string) => [
                                name === 'Price' ? formatCurrency(value) : `${value} sqft`,
                                name
                            ]}
                            animationDuration={200}
                        />
                        <Legend
                            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                            wrapperStyle={{ color: '#9CA3AF' }}
                        />
                        {Object.entries(groupedData).map(([category, points]) => (
                            <Scatter
                                key={category}
                                name={category}
                                data={points || []}
                                fill={COLORS[category as keyof typeof COLORS]}
                                opacity={filters.isFiltering && filters.sourceChart !== 'scatter-chart' ? 0.3 : 0.6}
                            >
                                {points?.map((_, index) => (
                                    <circle
                                        key={index}
                                        r={4}
                                        className="transition-opacity duration-300"
                                    />
                                ))}
                            </Scatter>
                        ))}
                        {selection.isSelecting && selection.startX !== null && selection.endX !== null && 
                         selection.startY !== null && selection.endY !== null && (
                            <ReferenceArea
                                x1={selection.startX}
                                x2={selection.endX}
                                y1={selection.startY}
                                y2={selection.endY}
                                fill="#8B5CF6"
                                fillOpacity={0.2}
                                stroke="#8B5CF6"
                                strokeOpacity={0.5}
                                strokeDasharray="3 3"
                            />
                        )}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScatterChartComponent;
