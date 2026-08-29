export default function PedidosFinalizados({ pedidos }) {
  if (pedidos.length === 0) {
    return <p className="cocina-empty">Aún no hay pedidos finalizados.</p>;
  }

  return (
    <div className="cocina-finalizados-list">
      {pedidos.map((p) => (
        <div key={p.id} className="cocina-finalizado-item">
          <span>{p.cliente} — {p.id}</span>
          <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--smoke)" }}>
            {new Date(p.finalizadoAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}