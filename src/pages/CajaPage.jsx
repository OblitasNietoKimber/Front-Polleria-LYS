import { useEffect, useState } from "react";
import cajaService from "../services/cajaService";
import ListaPedidos from "../components/caja/ListaPedidos";
import BuscadorPedidos from "../components/caja/BuscadorPedidos";
import DetalleVenta from "../components/caja/DetalleVenta";
import FormularioPago from "../components/caja/FormularioPago";
import TicketModal from "../components/caja/TicketModal";

export default function CajaPage() {
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
    </div>
  );
}
