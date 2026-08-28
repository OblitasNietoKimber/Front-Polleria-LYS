export default function PedidosFinalizados({ pedidos }) {
  if (pedidos.length === 0) {
    return (
      <p className="font-mono" style={{ color: "var(--smoke)" }}>
        Aún no hay pedidos finalizados.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {pedidos.map((p) => (
        <div
          key={p.id}
          className="ticket-card"
          style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between" }}
        >
          <span>{p.cliente} — {p.id}</span>
          <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--smoke)" }}>
            {new Date(p.finalizadoAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}