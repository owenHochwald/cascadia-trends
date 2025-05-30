import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { useEffect } from 'react';
import { fetchTrends } from './trendsSlice';
import { useCrossFiltering, useFilteredData } from '../../app/hooks';
import { updateFilters } from '../filters/filterSlice';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush
} from 'recharts';

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

interface TrendItem {
    year: number;
    month: number;
    average_price: number;
    median_sqft: number;
    average_price_per_sqft: number;
    total_sales: number;
    date?: string;
}

const TrendsChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.trends);

    const { filters } = useCrossFiltering('trends-chart');
    
    // Apply filters to data
    const filteredData = useFilteredData('trends-chart', data, (item: TrendItem, filters) => {
        const itemDate = `${item.year}-${item.month < 10 ? '0' + item.month : item.month}`;
        if (itemDate < filters.dateRange[0] || itemDate > filters.dateRange[1]) return false;
        return true;
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTrends());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-gray-400">Loading trends...</div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!filteredData) return null;

    const formattedData = filteredData.map((item) => ({
        ...item,
        date: `${item.year}-${item.month < 10 ? '0' + item.month : item.month}`
    }));

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Monthly Sales Trends</h2>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={formattedData}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                        />
                        <YAxis 
                            tick={{ fill: '#9CA3AF' }}
                            tickLine={{ stroke: '#4B5563' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                borderColor: '#374151',
                                color: '#F9FAFB'
                            }}
                            formatter={(value: number, name: string) => [
                                name === 'Avg Price' ? formatCurrency(value) : value,
                                name
                            ]}
                        />
                        <Legend 
                            wrapperStyle={{
                                color: '#9CA3AF'
                            }}
                        />
                        <Brush
                            dataKey="date"
                            height={30}
                            stroke="#4B5563"
                            fill="#111827"
                            onChange={(range) => {
                                if (range && range.startIndex !== undefined && range.endIndex !== undefined) {
                                    const start = formattedData[range.startIndex].date;
                                    const end = formattedData[range.endIndex].date;
                                    dispatch(updateFilters({
                                        dateRange: [start, end],
                                        sourceChart: 'trends-chart'
                                    }));
                                }
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="average_price"
                            name="Avg Price"
                            stroke="#8B5CF6"
                            dot={false}
                            opacity={filters.isFiltering && filters.sourceChart !== 'trends-chart' ? 0.3 : 1}
                        />
                        <Line
                            type="monotone"
                            dataKey="total_sales"
                            name="Total Sales"
                            stroke="#10B981"
                            dot={false}
                            opacity={filters.isFiltering && filters.sourceChart !== 'trends-chart' ? 0.3 : 1}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrendsChart;
