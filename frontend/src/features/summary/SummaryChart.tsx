import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchSummary } from './summarySlice';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    trend?: number;
}

const StatCard = ({ title, value, subtitle, trend = 0 }: StatCardProps) => (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col">
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {trend !== 0 && (
                <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
            )}
        </div>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
);

const SummaryChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.summary);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchSummary());
    }, [dispatch, status]);

    if (status === 'loading') {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading summary...</div>
            </div>
        );
    }

    if (status === 'failed' || !data) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-red-500">Error: {error || 'Failed to load data'}</div>
            </div>
        );
    }

    // Example trend data - you might want to calculate this from actual historical data
    const mockTrendData = [
        { month: 'Jan', value: data.average_price * 0.95 },
        { month: 'Feb', value: data.average_price * 0.97 },
        { month: 'Mar', value: data.average_price * 0.99 },
        { month: 'Apr', value: data.average_price * 0.98 },
        { month: 'May', value: data.average_price * 1.02 },
        { month: 'Jun', value: data.average_price }
    ];

    return (
        <div className="col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Average Price"
                    value={formatCurrency(data.average_price)}
                    subtitle="Per property"
                    trend={2.5}
                />
                <StatCard
                    title="Median Square Footage"
                    value={`${formatNumber(data.median_sqft)} sqft`}
                    subtitle="Living space"
                    trend={-1.2}
                />
                <StatCard
                    title="Total Sales"
                    value={formatNumber(data.total_sales)}
                    subtitle="Last 30 days"
                    trend={3.8}
                />
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-4">Price Trend</h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTrendData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fill: '#9CA3AF' }}
                                stroke="#4B5563"
                            />
                            <YAxis 
                                tick={{ fill: '#9CA3AF' }}
                                stroke="#4B5563"
                                tickFormatter={(value) => `$${formatNumber(value)}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151',
                                    color: '#F9FAFB'
                                }}
                                formatter={(value: number) => [formatCurrency(value), 'Price']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SummaryChart;
