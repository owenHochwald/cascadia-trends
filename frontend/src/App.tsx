import "./App.css"
import Counter from "./features/counter/Counter"
import SummaryChart from "./features/summary/SummaryChart"
export const App = () => (
  <div className="App">
    <header className="App-header">
        <Counter />
        <h1>Welcome to the Data Visualization App</h1>
        <SummaryChart />
    </header>
  </div>
)
