import { useMemo, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import cajaService from "../services/cajaService";
import FiltroFechas from "../components/admin/FiltroFechas";
import MetricasOperativas from "../components/admin/MetricasOperativas";
import ProductosTop from "../components/admin/ProductosTop";
import HistorialVentas from "../components/admin/HistorialVentas";
import TarjetasResumen from "../components/admin/TarjetasResumen";
import Ventas7Dias from "../components/admin/Ventas7Dias";
import VentasMetodoPago from "../components/admin/VentasMetodoPago";
import { IconoBilletera, IconoCampana, IconoGrafico, IconoTelefono, IconoUsuario } from "../components/common/Iconos";

export default function DashboardAdminPage() {
  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN453N6mpAhn09UKYb6yIXeJS43lFNZ41j7YQtRNGHgbZONCxXKd-xog&s=10";
  const [filtros, setFiltros] = useState({ fechaInicio: "", fechaFin: "" });
  const navigate = useNavigate();

  const resumen = useMemo(() => cajaService.getResumenVentas(), []);
  const productos = useMemo(() => cajaService.getProductosMasVendidos(filtros), [filtros]);
  const metodosPago = useMemo(() => cajaService.getVentasPorMetodoPago(filtros), [filtros]);
  const ventasPorDia = useMemo(() => cajaService.getVentasPorDia(filtros), [filtros]);
  const historial = useMemo(() => cajaService.getHistorialVentas(filtros), [filtros]);
  const pedidosPendientes = useMemo(() => cajaService.getPedidosPendientes().length, []);
  const tendenciasResumen = useMemo(() => cajaService.getTendenciasResumen(), []);
  const metricasPorDia = useMemo(() => cajaService.getMetricasOperativasPorDia(), []);

  const limpiarFiltros = () => setFiltros({ fechaInicio: "", fechaFin: "" });

  return (
    <div className="lys-root admin-screen">
      <header className="lys-nav admin-topbar">
        <NavLink to="/" className="admin-brand">
          <img src={logoUrl} alt="Logo Lenas y Sabores" className="admin-logo" />
          <span className="admin-system-title">Pollería Leñas & Sabores</span>
        </NavLink>

        <nav className="admin-nav">
          <button className="admin-nav-button active">Dashboard</button>
          <button className="admin-nav-button" onClick={() => navigate('/caja')}>Caja</button>
        </nav>

        <div className="admin-actions">
          <div className="admin-contact">
            <IconoTelefono size={15} color="var(--smoke)" />
            <span>Llámanos <strong>01 - 611 - 3333</strong></span>
          </div>

          <div className="admin-bell" title="Notificaciones">
            <IconoCampana size={20} />
            <span className="badge-count">3</span>
          </div>

          <div className="admin-user">
            <IconoUsuario size={18} color="var(--ink)" />
            <span>Hola, <strong>Administrador</strong></span>
          </div>
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-page-head">
          <div>
            <h1>DASHBOARD</h1>
            <p>Resumen general de tu restaurante</p>
          </div>

          <FiltroFechas filtros={filtros} onCambiar={setFiltros} onLimpiar={limpiarFiltros} />
        </section>

        <TarjetasResumen resumen={resumen} tendencias={tendenciasResumen} />
        <MetricasOperativas resumen={resumen} pedidosPendientes={pedidosPendientes} tendencias={metricasPorDia} />

        <section className="admin-double-grid">
          <VentasMetodoPago metodos={metodosPago} />
          <ProductosTop productos={productos} />
        </section>

        <section className="admin-double-grid">
          <Ventas7Dias ventas={ventasPorDia} />
          <HistorialVentas ventas={historial} />
        </section>
      </main>

      <nav className="admin-bottom-nav" aria-label="Navegacion principal de administracion">
        <NavLink to="/dashboard" className="admin-bottom-link">
          <IconoGrafico size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/caja" className="admin-bottom-link">
          <IconoBilletera size={19} />
          <span>Caja</span>
        </NavLink>
      </nav>
    </div>
  );
}
