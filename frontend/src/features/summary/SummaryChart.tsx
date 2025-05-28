import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchSummary } from './summarySlice';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SummaryChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.summary);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchSummary());
    }, [dispatch, status]);

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;
    if (data === null) return <p>No data available</p>;

    // We'll just use the first object for this example
    const summary = data;
    console.log(summary);
    const chartData = [
        { name: 'Average Price', value: summary.average_price },
        { name: 'Median Sqft', value: summary.median_sqft },
        { name: 'Total Sales', value: summary.total_sales },
    ];

    console.log(chartData);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SummaryChart;
