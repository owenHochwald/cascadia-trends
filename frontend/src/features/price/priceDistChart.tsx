

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../../app/store";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { fetchPriceDistribution } from "./priceDistSlice";

// Utility to bin the data into ranges (e.g., 0-100k, 100k-200k, etc.)
const createHistogramData = (prices: number[], binSize: number = 100000) => {
    const maxPrice = Math.max(...prices);
    const binCount = Math.ceil(maxPrice / binSize);
    const bins = new Array(binCount).fill(0);

    prices.forEach((price) => {
        const index = Math.floor(price / binSize);
        bins[index] += 1;
    });

    return bins.map((count, index) => ({
        range: `$${index * binSize / 1000}k - $${(index + 1) * binSize / 1000}k`,
        count,
    }));
};

const PriceDistributionChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.priceDist);

    useEffect(() => {
        if (status === "idle") dispatch(fetchPriceDistribution());
    }, [dispatch, status]);

    if (status === "loading") return <div className="text-center">Loading price distribution...</div>;
    if (status === "failed") return <div className="text-center text-red-500">Error: {error}</div>;
    if (!data) return null;

    const histogramData = createHistogramData(data, 100000); // Bin size: $100k

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Price Distribution Histogram</h2>
            <ResponsiveContainer width="90%" height={400}>
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" angle={-45} textAnchor="end" interval={0} />
                    <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceDistributionChart;
