import FilterPanel from "../features/filters/FilterPanel";
import SummaryChart from "../features/summary/SummaryChart";
import ScatterChartComponent from "../features/scatter/ScatterChart";
import SizeDistributionChart from "../features/size-distribtion/SizeDistributionChart";
import PriceDistributionChart from "../features/price/priceDistChart";
import BedroomChart from "../features/bedrooms/BedroomDistChart";

const Dashboard = () => (
    <div className="min-h-screen bg-gray-950 px-4 py-4 lg:px-8 lg:py-8">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Housing Market Analytics</h1>
            <p className="text-gray-400 mt-2">Interactive visualization of housing market trends</p>
        </header>

        <div className="max-w-[110rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Filters - First position in grid */}
                <div className="md:col-span-2 xl:col-span-1 xl:row-span-2">
                    <FilterPanel />
                </div>

                {/* Summary - Spans two columns */}
                <div className="md:col-span-2 bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg">
                    <SummaryChart />
                </div>

                {/* Individual chart sections */}
                <div className="bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg min-h-[450px]">
                    <ScatterChartComponent />
                </div>
                <div className="bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg min-h-[450px]">
                    <PriceDistributionChart />
                </div>
                <div className="bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg min-h-[450px]">
                    <SizeDistributionChart />
                </div>
                <div className="bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-lg min-h-[450px]">
                    <BedroomChart />
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;
