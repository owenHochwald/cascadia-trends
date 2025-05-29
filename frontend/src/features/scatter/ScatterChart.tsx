import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useEffect } from "react";
import { fetchScatter } from "./scatterSlice";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a28ef4"];

const ScatterChartComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.scatter);

    useEffect(() => {
        if (status === "idle") dispatch(fetchScatter());
    }, [dispatch, status]);

    if (status === "loading") {
        return <div className="text-center">Loading scatter chart...</div>;
    }
    if (status === "failed") {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    // Group data by bedroom_category
    const groupedData: { [key: string]: typeof data } = {};
    (data || []).forEach((item) => {
        if (!groupedData[item.bedroom_category]) {
            groupedData[item.bedroom_category] = [];
        }
        groupedData[item.bedroom_category].push(item);
    });

    const bedroomCategories = Object.keys(groupedData);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Price vs Sqft Living by Bedroom Category</h2>
            <ResponsiveContainer width="90%" height={400}>
                <ScatterChart
                    margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                    <CartesianGrid />
                    <XAxis
                        type="number"
                        dataKey="sqft_living"
                        name="Sqft Living"
                        unit=" sqft"
                    />
                    <YAxis
                        type="number"
                        dataKey="price"
                        name="Price"
                        unit="$"
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    {bedroomCategories.map((category, index) => (
                        <Scatter
                            key={category}
                            name={category}
                            data={groupedData[category]}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScatterChartComponent;
