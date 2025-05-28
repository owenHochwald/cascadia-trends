import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export type BaseChartProps = {
    loading?: boolean;
    error?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    // Allow nested chart elements for flexibility (e.g., histograms, scatter plots)
    children?: React.ReactNode;
}

const BaseChart: React.FC<BaseChartProps> = ({ loading, error, data, children }) => {
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', color: 'red' }}>
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
            <ResponsiveContainer width="100%" height={400}>
                {React.isValidElement(children)
                    ? children
                    : (
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        </LineChart>
                    )
                }
            </ResponsiveContainer>
        </div>
    );
};

export default BaseChart;