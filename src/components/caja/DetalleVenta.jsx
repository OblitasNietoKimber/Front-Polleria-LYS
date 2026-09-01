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
    <div className="caja-detail">
      <p className="font-display caja-detail-title">
        {pedido.id} — Mesa {pedido.mesa}
      </p>

      <div className="caja-divider" />

      <div className="caja-detail-items">
        {pedido.items.map((item, i) => (
          <div key={i} className="caja-detail-row">
            <span>{item.cantidad}x {item.nombre}</span>
            <span className="font-mono">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="caja-divider" />

      <div className="caja-total-row">
        <span>Total</span>
        <span className="font-mono caja-total-value">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}