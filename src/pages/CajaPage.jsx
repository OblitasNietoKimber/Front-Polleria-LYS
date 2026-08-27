import { useEffect, useState } from "react";
import cajaService from "../services/cajaService";
import ListaPedidos from "../components/caja/ListaPedidos";
import BuscadorPedidos from "../components/caja/BuscadorPedidos";
import DetalleVenta from "../components/caja/DetalleVenta";

export default function CajaPage() {
  const [pedidos, setPedidos] = useState([]);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setPedidos(cajaService.getPedidosPendientes());
  }, []);

  const pedidosFiltrados = pedidos.filter((p) =>
    `${p.id} ${p.mesa}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const pedidoActivo = cajaService.getPedidoPorId(seleccionadoId);

  return (
    <div className="lys-root" style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: 24 }}>
        Caja
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
        </div>
      </div>
    </div>
  );
}