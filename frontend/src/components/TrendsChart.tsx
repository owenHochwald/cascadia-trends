// src/components/charts/TrendsChart.tsx
import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getTrendsData } from '../../features/trends/trendsSlice';
import ChartContainer from './ChartContainer';

const TrendsChart: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector(state => state.trends);
    const filters = useAppSelector(state => state.filters);

    useEffect(() => {
        dispatch(getTrendsData());
    }, [dispatch, filters]);

    // Format dates for X-axis
    const formatXAxis = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
    };

    return (
        <ChartContainer title="Price Trends Over Time" status={status} error={error} height={400}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.trends || []} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                        label={{ value: 'Median Price ($)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `$${(value / 1000)}K`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Median Price']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="medianPrice"
                        name="Median Price"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="averagePrice"
                        name="Average Price"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default TrendsChart;