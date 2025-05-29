import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../../app/store";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { fetchBedrooms } from "./bedroomSlice";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const BedroomChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.bedrooms);

    useEffect(() => {
        if (status === "idle") dispatch(fetchBedrooms());
    }, [dispatch, status]);

    if (status === "loading") return <div className="text-center">Loading bedroom data...</div>;
    if (status === "failed") return <div className="text-center text-red-500">Error: {error}</div>;
    if (!data) return null;

    const pieData = [
        { name: "Small", value: data.small },
        { name: "Medium", value: data.medium },
        { name: "Large", value: data.large },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <h2 className="text-2xl font-bold mb-4">Bedroom Size Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BedroomChart;
