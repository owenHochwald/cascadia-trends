import "./App.css"
import SummaryChart from "./features/summary/SummaryChart"
import TrendsChart from "./features/trends/TrendsChart"
import ScatterChartComponent from "./features/scatter/ScatterChart"
export const App = () => (
    <div className="App">
        <header className="App-header">
            <h1>Welcome to the Data Visualization App</h1>
            <SummaryChart />
            <TrendsChart />
            <ScatterChartComponent />
        </header>
    </div>
)
