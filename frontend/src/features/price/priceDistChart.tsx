import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { RootState, AppDispatch } from "../../app/store";
import { useCrossFiltering, useFilteredData } from '../../app/hooks';
import '../../styles/animations.css';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
    Cell
} from "recharts";
import { fetchPriceDistribution } from "./priceDistSlice";

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.round(amount));
};

// Optimized histogram data creation
const createHistogramData = (prices: number[], binCount = 20) => {
    if (!prices.length) return [];
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const binSize = (maxPrice - minPrice) / binCount;
    const bins = new Array(binCount).fill(0);

    prices.forEach((price) => {
        const index = Math.min(
            Math.floor((price - minPrice) / binSize),
            binCount - 1
        );
        bins[index] += 1;
    });

    return bins.map((count, index) => {
        const startPrice = minPrice + index * binSize;
        const endPrice = minPrice + (index + 1) * binSize;
        return {
            range: [startPrice, endPrice],
            rangeLabel: `${formatCurrency(startPrice)} - ${formatCurrency(endPrice)}`,
            count,
        };
    });
};

const PriceDistributionChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.priceDist);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const { filters, updateChartFilters } = useCrossFiltering('price-dist-chart');
    
    // Memoize filtered data
    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(price => 
            price >= filters.priceRange[0] && 
            price <= filters.priceRange[1]
        );
    }, [data, filters.priceRange]);

    useEffect(() => {
        if (status === "idle") dispatch(fetchPriceDistribution());
    }, [dispatch, status]);

    // Memoize histogram data
    const histogramData = useMemo(() => {
        return createHistogramData(filteredData);
    }, [filteredData, createHistogramData]);

    const handleBrushChange = useCallback((range: any) => {
        if (range && range.startIndex !== undefined && range.endIndex !== undefined) {
            const start = histogramData[range.startIndex].range[0];
            const end = histogramData[range.endIndex].range[1];
            updateChartFilters({
                priceRange: [start, end]
            });
        }
    }, [histogramData, updateChartFilters]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">Loading price distribution...</div>
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

    if (!filteredData.length) return null;

    return (
        <div className="h-full chart-content">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Price Distribution</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={histogramData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barGap={2}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="rangeLabel"
                            angle={-45}
                            textAnchor="end"
                            height={90}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            stroke="#4B5563"
                            interval={1}
                            tickMargin={15}
                        />
                        <YAxis 
                            tick={{ fill: '#9CA3AF' }}
                            stroke="#4B5563"
                            tickMargin={8}
                            label={{ 
                                value: 'Number of Properties',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#9CA3AF',
                                offset: 10
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                borderColor: '#374151',
                                color: '#F9FAFB',
                                transition: 'all 200ms ease-in-out',
                                fontSize: '12px',
                                padding: '8px'
                            }}
                            formatter={(value: number) => [value, 'Properties']}
                            labelFormatter={(label) => `Price Range: ${label}`}
                        />
                        <Brush
                            dataKey="rangeLabel"
                            height={30}
                            stroke="#4B5563"
                            fill="#111827"
                            onChange={handleBrushChange}
                            startIndex={0}
                            endIndex={histogramData.length - 1}
                        />
                        <Bar
                            dataKey="count"
                            fill="#8B5CF6"
                            opacity={filters.isFiltering && filters.sourceChart !== 'price-dist-chart' ? 0.3 : 0.8}
                            onMouseEnter={(_data, index) => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                            isAnimationActive={false}
                        >
                            {histogramData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === hoveredBar ? '#A78BFA' : '#8B5CF6'}
                                    opacity={
                                        filters.isFiltering && filters.sourceChart !== 'price-dist-chart'
                                            ? 0.3
                                            : entry.range[0] >= filters.priceRange[0] && 
                                              entry.range[1] <= filters.priceRange[1]
                                                ? 0.8
                                                : 0.3
                                    }
                                    style={{ 
                                        transition: 'opacity 300ms ease-in-out, fill 200ms ease-in-out',
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceDistributionChart;
