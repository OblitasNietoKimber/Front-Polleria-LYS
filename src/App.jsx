import "./App.css";
import CocinaPage from "./pages/CocinaPage";

function App() {
  return (
    <CocinaPage
      onIrDashboard={() => alert("Este botón se conectará cuando se junten las ramas en dev")}
      onIrCaja={() => alert("Este botón se conectará cuando se junten las ramas en dev")}
    />
  );
}

export default App;
