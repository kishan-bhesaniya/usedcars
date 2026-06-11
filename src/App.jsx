import { useEffect, useState } from "react";
import "./App.css";
import Dashboard01 from "./pages/dashboard";

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

  return <Dashboard01 />;
}

export default App;
