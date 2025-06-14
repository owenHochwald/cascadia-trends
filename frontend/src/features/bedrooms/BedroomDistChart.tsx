import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useEffect } from "react";
import { fetchBedrooms } from "./bedroomSlice";
import { useCrossFiltering } from "../../app/hooks";
import '../../styles/animations.css';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

const COLORS = ["#F59E0B", "#10B981", "#8B5CF6"];
const RADIAN = Math.PI / 180;

// Custom label for the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const BedroomChart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, status, error } = useSelector((state: RootState) => state.bedrooms);
    const { filters, updateChartFilters } = useCrossFiltering('bedroom-chart');

    useEffect(() => {
        if (status === "idle") dispatch(fetchBedrooms());
    }, [dispatch, status]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-400">Loading bedroom data...</div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!data) return null;

    const pieData = [
        { name: "Small", value: data.small },
        { name: "Medium", value: data.medium },
        { name: "Large", value: data.large },
    ];

    const barData = pieData.map(item => ({
        ...item,
        percentage: (item.value / data.total * 100).toFixed(1)
    }));

    return (
        <div className="h-full chart-content">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Property Size Distribution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                {/* Pie Chart */}
                <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="90%"
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={true}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]}
                                        opacity={filters.bedroomCategory && 
                                                entry.name.toLowerCase() !== filters.bedroomCategory
                                                    ? 0.3 
                                                    : 1}
                                        onClick={() => updateChartFilters({
                                            bedroomCategory: filters.bedroomCategory === entry.name.toLowerCase()
                                                ? undefined
                                                : entry.name.toLowerCase()
                                        })}
                                        style={{ 
                                            cursor: 'pointer', 
                                            transition: 'opacity 500ms ease-in-out'
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151',
                                    color: '#F9FAFB',
                                    transition: 'all 200ms ease-in-out'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                type="number"
                                tick={{ fill: '#9CA3AF' }}
                                stroke="#4B5563"
                                unit="%"
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#9CA3AF' }}
                                stroke="#4B5563"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151',
                                    color: '#F9FAFB',
                                    transition: 'all 200ms ease-in-out'
                                }}
                                formatter={(value: any) => [`${value}%`, 'Distribution']}
                            />
                            <Bar
                                dataKey="percentage"
                                fill="#8884d8"
                                radius={[0, 4, 4, 0]}
                                onClick={(data) => updateChartFilters({
                                    bedroomCategory: filters.bedroomCategory === data.name.toLowerCase()
                                        ? undefined
                                        : data.name.toLowerCase()
                                })}
                                style={{ cursor: 'pointer' }}
                                isAnimationActive={true}
                            >
                                {barData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        opacity={filters.bedroomCategory && 
                                                entry.name.toLowerCase() !== filters.bedroomCategory
                                                    ? 0.3 
                                                    : 1}
                                        style={{ 
                                            transition: 'opacity 500ms ease-in-out',
                                        }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BedroomChart;
