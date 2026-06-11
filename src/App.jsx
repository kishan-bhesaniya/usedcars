import { useEffect, useState } from "react";
import "./App.css";
import Dashboard01 from "./pages/dashboard";
import CarsDetailsPage from "./pages/cars-details";
import CarsPage from "./pages/cars";
function getCurrentPath() {
  return window.location.pathname || "/";
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(getCurrentPath());
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  if (pathname === "/car" || pathname === "/cars") {
    return <CarsPage />;
  }

  if (
    pathname.startsWith("/car-details/") ||
    pathname.startsWith("/cars-details/")
  ) {
    return <CarsDetailsPage />;
  }

  return <Dashboard01 />;
}

export default App;
