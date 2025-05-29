import "./App.css";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";

export const App = () => (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
        </Routes>
    </BrowserRouter>
);

