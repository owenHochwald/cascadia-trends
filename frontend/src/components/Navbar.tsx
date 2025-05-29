import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react"; // optional icon library

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isAbout = location.pathname === "/about";

  return (
    <nav className="bg-black text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-xl font-semibold tracking-wide">📊 DataViz</h1>

      <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
        <Menu size={28} />
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-900 text-white rounded-xl shadow-xl w-40 p-4 transition-all duration-200">
          <ul className="space-y-2">
            {isAbout ? (
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-gray-300">
                  Home
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-gray-300">
                  About
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
