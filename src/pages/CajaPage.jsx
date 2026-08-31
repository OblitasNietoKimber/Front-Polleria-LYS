import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import cajaService from "../services/cajaService";
import ListaPedidos from "../components/caja/ListaPedidos";
import BuscadorPedidos from "../components/caja/BuscadorPedidos";
import DetalleVenta from "../components/caja/DetalleVenta";
import FormularioPago from "../components/caja/FormularioPago";
import TicketModal from "../components/caja/TicketModal";
import { IconoCampana, IconoTelefono, IconoUsuario } from "../components/common/Iconos";

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
    <div className="lys-root admin-screen">
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

      <main style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: 24 }}>
          CAJA
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          <div>
            <BuscadorPedidos valor={busqueda} onChange={setBusqueda} />
            <ListaPedidos
              pedidos={pedidosFiltrados}
              pedidoSeleccionado={seleccionadoId}
              onSeleccionar={setSeleccionadoId}
            />
          </div>

          <div className="ticket-card" style={{ padding: 20 }}>
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
                  <p style={{ marginTop: 12, fontWeight: 600 }}>
                    Vuelto:{" "}
                    <span className="font-mono" style={{ color: "var(--gold)" }}>
                      S/ {vuelto.toFixed(2)}
                    </span>
                  </p>
                )}

                <button
                  className="btn-ember"
                  style={{ width: "100%", marginTop: 16 }}
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
    </div>
  );
}