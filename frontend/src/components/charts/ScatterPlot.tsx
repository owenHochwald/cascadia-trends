// src/components/charts/ScatterPlot.tsx
import React, { useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getScatterData } from '../../features/scatter/scatterSlice';
import ChartContainer from './ChartContainer';

const ScatterPlot: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector(state => state.scatter);
    const filters = useAppSelector(state => state.filters);

    useEffect(() => {
        dispatch(getScatterData());
    }, [dispatch, filters]);

    // Custom tooltip formatter
    const tooltipFormatter = (item: any) => {
        return [
            <div key="price">Price: ${item.price.toLocaleString()}</div>,
            <div key="sqft">Sqft: {item.sqft.toLocaleString()}</div>,
            <div key="bedrooms">Bedrooms: {item.bedrooms}</div>
        ];
    };

    return (
        <ChartContainer title="Price vs. Square Footage" status={status} error={error} height={400}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="sqft"
                        name="Square Footage"
                        label={{ value: 'Square Footage', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="price"
                        name="Price"
                        label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `$${(value / 1000)}K`}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Scatter
                        name="Properties"
                        data={data?.points || []}
                        fill="#8884d8"
                        shape="circle"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default ScatterPlot;