import { useState } from "react";
import "./App.css";
import CajaPage from "./pages/CajaPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";

function App() {
  const [pagina, setPagina] = useState("dashboard");

  if (pagina === "dashboard") {
    return <DashboardAdminPage onIrCaja={() => setPagina("caja")} />;
  }

  return <CajaPage />;
}

export default App;