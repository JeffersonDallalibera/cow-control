import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnimalPage from "./pages/AnimalPage";
import CCSPage from "./pages/CCSPage";
import RaquetePage from "./pages/RaquetePage";
import CCSTanquePage from "./pages/CCSTanquePage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 flex gap-4">
          <Link to="/animal">Animais</Link>
          <Link to="/ccs">CCS Individual</Link>
          <Link to="/raquete">Raquete</Link>
          <Link to="/ccs-tanque">CCS Tanque</Link>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/animal" element={<AnimalPage />} />
            <Route path="/ccs" element={<CCSPage />} />
            <Route path="/raquete" element={<RaquetePage />} />
            <Route path="/ccs-tanque" element={<CCSTanquePage />} />
            <Route path="*" element={<AnimalPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
