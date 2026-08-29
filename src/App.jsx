import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from "react";
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CatalogoPage from './pages/CatalogoPage'
import EntregaPage from './pages/checkout/EntregaPage'
import PagoPage from './pages/checkout/PagoPage'
import ResumenPage from './pages/checkout/ResumenPage'
import ConfirmacionPage from './pages/ConfirmacionPage'
import CajaPage from "./pages/CajaPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import PedidosPage from './pages/PedidosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/checkout/entrega" element={<EntregaPage />} />
          <Route path="/checkout/pago" element={<PagoPage />} />
          <Route path="/checkout/resumen" element={<ResumenPage />} />
          <Route path="/confirmacion" element={<ConfirmacionPage />} />
          <Route path="/caja" element={<CajaPage />} />
          <Route path="/dashboard" element={<DashboardAdminPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;