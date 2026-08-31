
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CocinaPage from "./pages/CocinaPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/common/ProtectedRoute';
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
import OrderDetailPage from './pages/OrderDetailPage'






function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile/*" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/checkout/entrega" element={<EntregaPage />} />
          <Route path="/checkout/pago" element={<PagoPage />} />
          <Route path="/checkout/resumen" element={<ResumenPage />} />
          <Route path="/confirmacion" element={<ConfirmacionPage />} />
        </Route>

        <Route path="/caja" element={<CajaPage />} />
        <Route path="/dashboard" element={<DashboardAdminPage />} />

        <Route path="/pedidos" element={<PedidosPage />} />
        <Route path="/pedidos/:id" element={<OrderDetailPage />} />
        <Route path="/cocina" element={<CocinaPage />} />
        

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

