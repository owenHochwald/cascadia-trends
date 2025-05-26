import "./App.css"
import renderLineChart from "./components/charts/BaseChart"

export const App = () => (
  <div className="App">
    <header className="App-header">
        {renderLineChart }
        <h1>Welcome to the Data Visualization App</h1>
    </header>
  </div>
)
