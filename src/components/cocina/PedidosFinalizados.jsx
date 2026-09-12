import { useTiempoTranscurrido } from "../../hooks/useTiempoTranscurrido";

function FilaPedido({ pedido }) {
  const { texto: duracion } = useTiempoTranscurrido(pedido.createdAt, pedido.finalizadoAt);

  return (
    <div className="cocina-finalizado-item">
      <div>
        <span style={{ fontWeight: 700 }}>{pedido.id}</span>
        <span className="cocina-id" style={{ marginLeft: 8 }}>{pedido.cliente}</span>
      </div>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <span className="font-mono" style={{ fontSize: "0.78rem", color: "var(--smoke)" }}>
          Preparación: {duracion}
        </span>
        <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--smoke)" }}>
          {new Date(pedido.finalizadoAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

export default function PedidosFinalizados({ pedidos }) {
  if (pedidos.length === 0) {
    return <p className="cocina-empty">Aún no hay pedidos aquí.</p>;
  }

  return (
    <div className="cocina-finalizados-list">
      {pedidos.map((p) => (
        <FilaPedido key={p.id} pedido={p} />
      ))}
    </div>
  );
}