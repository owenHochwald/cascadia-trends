import "./App.css"
import SummaryChart from "./features/summary/SummaryChart"
import TrendsChart from "./features/trends/TrendsChart"
import ScatterChartComponent from "./features/scatter/ScatterChart"
import SizeDistributionChart from "./features/size-distribtion/SizeDistributionChart"
import PriceDistributionChart from "./features/price/priceDistChart"
import BedroomChart from "./features/bedrooms/BedroomDistChart"
export const App = () => (
    <div className="App">
        <header className="App-header">
            <h1>Welcome to the Data Visualization App</h1>
            <SummaryChart />
            <TrendsChart />
            <ScatterChartComponent />
            <PriceDistributionChart />
            <SizeDistributionChart />
            <BedroomChart />
        </header>
    </div>
)
