import { useMemo } from "react";
import cajaService from "../services/cajaService";
import MetricasOperativas from "../components/admin/MetricasOperativas";
import ProductosTop from "../components/admin/ProductosTop";
import TarjetasResumen from "../components/admin/TarjetasResumen";
import Ventas7Dias from "../components/admin/Ventas7Dias";
import VentasMetodoPago from "../components/admin/VentasMetodoPago";
import { IconoCampana, IconoTelefono, IconoUsuario } from "../components/common/Iconos";

export default function DashboardAdminPage({ onIrCaja }) {
  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN453N6mpAhn09UKYb6yIXeJS43lFNZ41j7YQtRNGHgbZONCxXKd-xog&s=10";
  const filtros = useMemo(() => ({}), []);

  const resumen = useMemo(() => cajaService.getResumenVentas(), []);
  const productos = useMemo(() => cajaService.getProductosMasVendidos(filtros), []);
  const metodosPago = useMemo(() => cajaService.getVentasPorMetodoPago(filtros), []);
  const ventasPorDia = useMemo(() => cajaService.getVentasPorDia(filtros), []);
  const pedidosPendientes = useMemo(() => cajaService.getPedidosPendientes().length, []);

  return (
    <div className="lys-root admin-screen">
      <header className="lys-nav admin-topbar">
        <div className="admin-brand">
          <img src={logoUrl} alt="Logo Lenas y Sabores" className="admin-logo" />
          <span className="admin-system-title">Polleria Lenas & Sabores</span>
        </div>

        <nav className="admin-nav">
          <button className="admin-nav-button active">Dashboard</button>
          <button className="admin-nav-button" onClick={onIrCaja}>Caja</button>
        </nav>

        <div className="admin-actions">
          <div className="admin-contact">
            <IconoTelefono size={15} color="var(--smoke)" />
            <span>Llamanos <strong>01 - 611 - 3333</strong></span>
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
        </section>

        <TarjetasResumen resumen={resumen} />
        <MetricasOperativas resumen={resumen} pedidosPendientes={pedidosPendientes} />

        <section className="admin-double-grid">
          <VentasMetodoPago metodos={metodosPago} />
          <ProductosTop productos={productos} />
        </section>

        <section className="admin-double-grid">
          <Ventas7Dias ventas={ventasPorDia} />
        </section>
      </main>
    </div>
  );
}