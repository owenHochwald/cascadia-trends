import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { useEffect } from 'react';
import { fetchTrends } from './trendsSlice';
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';



const TrendsChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.trends);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchTrends());
    }, [dispatch, status]);

    if (status === 'loading') {
        return <div className="text-center">Loading trends...</div>;
    }
    if (status === 'failed') {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    const formattedData = data?.map((item) => ({
        ...item,
        data: `${item.year}-${item.month < 10 ? '0' + item.month : item.month}`,
    }));

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Monthly Sales Trends</h2>
            <ResponsiveContainer width="90%" height={400}>
                <ScatterChart
                    margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                    <CartesianGrid />
                    <XAxis
                        dataKey="date"
                        name="Date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        dataKey="total_sales"
                        name="Total Sales"
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Total Sales" data={formattedData} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendsChart;
