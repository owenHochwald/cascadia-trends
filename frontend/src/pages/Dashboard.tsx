import SummaryChart from "../features/summary/SummaryChart";
import TrendsChart from "../features/trends/TrendsChart";
import ScatterChartComponent from "../features/scatter/ScatterChart";
import SizeDistributionChart from "../features/size-distribtion/SizeDistributionChart";
import PriceDistributionChart from "../features/price/priceDistChart";
import BedroomChart from "../features/bedrooms/BedroomDistChart";

const Dashboard = () => (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to the Data Visualization App</h1>
        </header>

        <main className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-4 rounded-2xl shadow"><SummaryChart /></div>
            <div className="bg-white p-4 rounded-2xl shadow"><TrendsChart /></div>
            <div className="bg-white p-4 rounded-2xl shadow"><ScatterChartComponent /></div>
            <div className="bg-white p-4 rounded-2xl shadow"><PriceDistributionChart /></div>
            <div className="bg-white p-4 rounded-2xl shadow"><SizeDistributionChart /></div>
            <div className="bg-white p-4 rounded-2xl shadow"><BedroomChart /></div>
        </main>
    </div>
);

export default Dashboard;
