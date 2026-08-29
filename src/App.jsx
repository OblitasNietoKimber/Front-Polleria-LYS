import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CocinaPage from "./pages/CocinaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cocina" element={<CocinaPage />} />
        <Route path="*" element={<Navigate to="/cocina" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
