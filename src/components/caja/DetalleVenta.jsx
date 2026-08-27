import cajaService from "../../services/cajaService";

export default function DetalleVenta({ pedido }) {
  if (!pedido) {
    return (
      <p className="font-mono" style={{ color: "var(--smoke)" }}>
        Selecciona un pedido para ver el detalle
      </p>
    );
  }

  const total = cajaService.calcularTotal(pedido);

  return (
    <div>
      <p className="font-display" style={{ fontSize: "1.2rem", marginBottom: 4 }}>
        {pedido.id} — Mesa {pedido.mesa}
      </p>

      <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />

      {pedido.items.map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>{item.cantidad}x {item.nombre}</span>
          <span className="font-mono">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
        </div>
      ))}

      <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
        <span>Total</span>
        <span className="font-mono" style={{ color: "var(--ember)" }}>S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}