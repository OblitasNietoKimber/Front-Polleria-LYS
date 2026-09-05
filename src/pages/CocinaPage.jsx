import "../styles/cocina.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePedidosCocina from "../hooks/usePedidosCocina";
import cocinaService, { ESTADOS_COCINA } from "../services/cocinaService";
import ColumnaPedidos from "../components/cocina/ColumnaPedidos";
import TarjetaPedidoCocina from "../components/cocina/TarjetaPedidoCocina";
import PedidosFinalizados from "../components/cocina/PedidosFinalizados";
import { IconoCampana } from "../components/common/Iconos";

export default function CocinaPage() {
  const navigate = useNavigate();
  const { pedidos, recargar } = usePedidosCocina();
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  function handleCambiarEstado(id, nuevoEstado) {
    cocinaService.cambiarEstado(id, nuevoEstado);
    recargar();
  }

  const nuevos = pedidos.filter((p) => p.estadoCocina === ESTADOS_COCINA.NUEVO);
  const enPreparacion = pedidos.filter((p) => p.estadoCocina === ESTADOS_COCINA.EN_PREPARACION);
  const listos = pedidos.filter((p) => p.estadoCocina === ESTADOS_COCINA.LISTO);
  const finalizados = cocinaService.getPedidosFinalizados();

  return (
    <div className="lys-root admin-screen">
      <main style={{ padding: 32, maxWidth: 1300, margin: "0 auto" }}>
        <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: 24 }}>
          Panel de Cocina
        </h1>

        <div className="cocina-board">
          <ColumnaPedidos titulo="Nuevos" colorClase="cocina-dot--nuevo" pedidos={nuevos}>
            {nuevos.map((p) => (
              <TarjetaPedidoCocina key={p.id} pedido={p} onCambiarEstado={handleCambiarEstado} />
            ))}
          </ColumnaPedidos>

          <ColumnaPedidos titulo="En preparación" colorClase="cocina-dot--preparacion" pedidos={enPreparacion}>
            {enPreparacion.map((p) => (
              <TarjetaPedidoCocina key={p.id} pedido={p} onCambiarEstado={handleCambiarEstado} />
            ))}
          </ColumnaPedidos>

          <ColumnaPedidos titulo="Listos" colorClase="cocina-dot--listo" pedidos={listos}>
            {listos.map((p) => (
              <TarjetaPedidoCocina key={p.id} pedido={p} onCambiarEstado={handleCambiarEstado} />
            ))}
          </ColumnaPedidos>
        </div>

        <div style={{ marginTop: 40 }}>
          <button className="btn-outline" onClick={() => setMostrarFinalizados((v) => !v)}>
            {mostrarFinalizados ? "Ocultar" : "Ver"} pedidos finalizados ({finalizados.length})
          </button>

          {mostrarFinalizados && (
            <div style={{ marginTop: 16 }}>
              <PedidosFinalizados pedidos={finalizados} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}