export default function ListaPedidos({ pedidos, pedidoSeleccionado, onSeleccionar }) {
  if (pedidos.length === 0) {
    return <p className="font-mono" style={{ color: "var(--smoke)" }}>No hay pedidos pendientes.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className="ticket-card"
          onClick={() => onSeleccionar(pedido.id)}
          style={{
            padding: "16px 20px",
            outline: pedidoSeleccionado === pedido.id ? "2px solid var(--ember)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 600 }}>{pedido.cliente}</p>
              <p className="font-mono" style={{ fontSize: "0.8rem", color: "var(--smoke)" }}>
                {pedido.id}
              </p>
            </div>
            <span className="chip active">Mesa {pedido.mesa}</span>
          </div>
        </div>
      ))}
    </div>
  );
}