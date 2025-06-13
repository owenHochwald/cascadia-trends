import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchSummary } from './summarySlice';

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
    isLarge?: boolean;
}

const StatCard = ({ title, value, subtitle, trend = 0, isLarge = false }: StatCardProps) => (
    <div className={`bg-gray-800 rounded-xl p-6 flex flex-col ${isLarge ? 'h-[200px] justify-center' : ''}`}>
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-bold text-white`}>{value}</span>
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
                title="Average Price"
                value={formatCurrency(data.average_price)}
                subtitle="Per property"
                trend={2.5}
                isLarge={true}
            />
            <StatCard
                title="Median Square Footage"
                value={`${formatNumber(data.median_sqft)} sqft`}
                subtitle="Living space"
                trend={-1.2}
                isLarge={true}
            />
            <StatCard
                title="Total Sales"
                value={formatNumber(data.total_sales)}
                subtitle="Last 30 days"
                trend={3.8}
                isLarge={true}
            />
        </div>
    );
};

export default SummaryChart;
