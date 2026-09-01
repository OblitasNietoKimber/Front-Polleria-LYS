import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import cajaService from "../services/cajaService";
import ListaPedidos from "../components/caja/ListaPedidos";
import BuscadorPedidos from "../components/caja/BuscadorPedidos";
import DetalleVenta from "../components/caja/DetalleVenta";
import FormularioPago from "../components/caja/FormularioPago";
import TicketModal from "../components/caja/TicketModal";
import { IconoBilletera, IconoCampana, IconoGrafico, IconoTelefono, IconoUsuario } from "../components/common/Iconos";

export default function CajaPage() {
  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN453N6mpAhn09UKYb6yIXeJS43lFNZ41j7YQtRNGHgbZONCxXKd-xog&s=10";
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [monto, setMonto] = useState("");
  const [mostrarTicket, setMostrarTicket] = useState(false);

  useEffect(() => {
    setPedidos(cajaService.getPedidosPendientes());
  }, []);

  const pedidosFiltrados = pedidos.filter((p) =>
    `${p.id} ${p.mesa}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const pedidoActivo = cajaService.getPedidoPorId(seleccionadoId);
  const total = pedidoActivo ? cajaService.calcularTotal(pedidoActivo) : 0;
  const vuelto = monto ? Math.max(0, parseFloat(monto) - total) : 0;

  function confirmarVenta() {
    cajaService.marcarComoPagado(seleccionadoId, {
      metodo,
      monto: parseFloat(monto),
      vuelto,
    });
    setMostrarTicket(true);
  }

  function cerrarTicket() {
    setMostrarTicket(false);
    setPedidos(cajaService.getPedidosPendientes());
    setSeleccionadoId(null);
    setMonto("");
  }

  return (
    <div className="lys-root admin-screen caja-page">
      <header className="lys-nav admin-topbar">
        <NavLink to="/" className="admin-brand">
          <img src={logoUrl} alt="Logo Lenas y Sabores" className="admin-logo" />
          <span className="admin-system-title">Pollería Leñas & Sabores</span>
        </NavLink>

        <nav className="admin-nav">
          <button className="admin-nav-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="admin-nav-button active">Caja</button>
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

      <main className="caja-main">
        <h1 className="caja-title font-display">CAJA</h1>

        <div className="caja-layout">
          <div className="caja-column">
            <BuscadorPedidos valor={busqueda} onChange={setBusqueda} />
            <ListaPedidos
              pedidos={pedidosFiltrados}
              pedidoSeleccionado={seleccionadoId}
              onSeleccionar={setSeleccionadoId}
            />
          </div>

          <div className="ticket-card caja-panel">
            <DetalleVenta pedido={pedidoActivo} />

            {pedidoActivo && (
              <>
                <FormularioPago
                  metodo={metodo}
                  onMetodoChange={setMetodo}
                  monto={monto}
                  onMontoChange={setMonto}
                />

                {monto && (
                  <p className="caja-vuelto">
                    Vuelto:{" "}
                    <span className="font-mono caja-vuelto-value">
                      S/ {vuelto.toFixed(2)}
                    </span>
                  </p>
                )}

                <button
                  className="btn-ember caja-confirm-button"
                  disabled={!monto || parseFloat(monto) < total}
                  onClick={confirmarVenta}
                >
                  Confirmar venta
                </button>
              </>
            )}
          </div>
        </div>

        {mostrarTicket && (
          <TicketModal
            pedido={pedidoActivo}
            total={total}
            metodo={metodo}
            monto={parseFloat(monto)}
            vuelto={vuelto}
            onClose={cerrarTicket}
          />
        )}
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