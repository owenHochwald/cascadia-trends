import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../../app/store";
import { useCrossFiltering, useFilteredData } from '../../app/hooks';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
    Cell,
    Line,
    ComposedChart
} from "recharts";
import { fetchSizeDistribution } from "./sizeSlice";

// Utility to bin the data into ranges and calculate cumulative percentages
const createSizeHistogramData = (sizes: number[], binCount = 30) => {
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    const binSize = (maxSize - minSize) / binCount;
    const bins = new Array(binCount).fill(0);

    sizes.forEach((size) => {
        const index = Math.min(Math.floor((size - minSize) / binSize), binCount - 1);
        bins[index] += 1;
    });

    const totalCount = sizes.length;
    let cumulativeCount = 0;

    return bins.map((count, index) => {
        cumulativeCount += count;
        return {
            range: `${Math.round(minSize + index * binSize)}-${Math.round(minSize + (index + 1) * binSize)}`,
            count,
            cumulative: (cumulativeCount / totalCount) * 100
        };
    });
};

const SizeDistributionChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.sizeDist);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const { filters, updateChartFilters } = useCrossFiltering('size-dist-chart');
    
    // Apply filters to data
    const filteredData = useFilteredData('size-dist-chart', data, (size, filters) => {
        if (size < filters.sqftRange[0] || size > filters.sqftRange[1]) return false;
        return true;
    });

    useEffect(() => {
        if (status === "idle") dispatch(fetchSizeDistribution());
    }, [dispatch, status]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">
                    Loading size distribution...
                </div>
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

    const histogramData = createSizeHistogramData(filteredData);

    return (
        <div className="h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Size Distribution
            </h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={histogramData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="range"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            stroke="#4B5563"
                            interval={2}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fill: '#9CA3AF' }}
                            stroke="#4B5563"
                            label={{
                                value: 'Count',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#9CA3AF'
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#9CA3AF' }}
                            stroke="#4B5563"
                            label={{
                                value: 'Cumulative %',
                                angle: 90,
                                position: 'insideRight',
                                fill: '#9CA3AF'
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                borderColor: '#374151',
                                color: '#F9FAFB'
                            }}
                            formatter={(value: number, name: string) => [
                                name === 'count'
                                    ? value
                                    : `${value.toFixed(1)}%`,
                                name === 'count' ? 'Properties' : 'Cumulative'
                            ]}
                            labelFormatter={(label) => `Size Range: ${label} sqft`}
                        />
                        <Brush
                            dataKey="range"
                            height={30}
                            stroke="#4B5563"
                            fill="#111827"
                            onChange={(range) => {
                                if (range && range.startIndex !== undefined && range.endIndex !== undefined) {
                                    const startRange = histogramData[range.startIndex].range.split('-')[0];
                                    const endRange = histogramData[range.endIndex].range.split('-')[1];
                                    updateChartFilters({
                                        sqftRange: [Number(startRange), Number(endRange)]
                                    });
                                }
                            }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="count"
                            fill="#10B981"
                            opacity={filters.isFiltering && filters.sourceChart !== 'size-dist-chart' ? 0.3 : 0.8}
                            onMouseEnter={(_, index) => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {histogramData.map((entry, index) => {
                                const [start, end] = entry.range.split('-').map(Number);
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === hoveredBar ? '#34D399' : '#10B981'}
                                        opacity={
                                            filters.isFiltering && filters.sourceChart !== 'size-dist-chart'
                                                ? 0.3
                                                : start >= filters.sqftRange[0] && 
                                                  end <= filters.sqftRange[1]
                                                    ? 0.8
                                                    : 0.3
                                        }
                                    />
                                );
                            })}
                        </Bar>
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#8B5CF6"
                            dot={false}
                            opacity={filters.isFiltering && filters.sourceChart !== 'size-dist-chart' ? 0.3 : 1}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SizeDistributionChart;
