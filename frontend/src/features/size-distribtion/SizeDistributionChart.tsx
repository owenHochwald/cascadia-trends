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
import { fetchSizeDistribution } from "./sizeSlice";

// Group square footage values into bins
const createSizeHistogramData = (sizes: number[], binSize: number = 500) => {
    const maxSize = Math.max(...sizes);
    const binCount = Math.ceil(maxSize / binSize);
    const bins = new Array(binCount).fill(0);

    sizes.forEach((size) => {
        const index = Math.floor(size / binSize);
        bins[index] += 1;
    });

    return bins.map((count, index) => ({
        range: `${index * binSize}–${(index + 1) * binSize} sqft`,
        count,
    }));
};

const SizeDistributionChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.sizeDist); // <-- Update this to match your store

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchSizeDistribution());
        }
    }, [dispatch, status]);

    if (status === "loading") {
        return <div className="text-center">Loading size distribution...</div>;
    }
    if (status === "failed") {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    if (!data) return null;

    const histogramData = createSizeHistogramData(data, 500); // Bin size: 500 sqft

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Size Distribution Histogram</h2>
            <ResponsiveContainer width="90%" height={400}>
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" angle={-45} textAnchor="end" interval={0} />
                    <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SizeDistributionChart;
