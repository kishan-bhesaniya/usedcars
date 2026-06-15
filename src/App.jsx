import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CarsDetailsPage from "./pages/cars-details";
import CarsPage from "./pages/cars";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/car" element={<CarsPage />} />
      <Route path="/cars" element={<Navigate to="/car" replace />} />
      <Route path="/car-details/:carId" element={<CarsDetailsPage />} />
      <Route path="/cars-details/:carId" element={<CarsDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
