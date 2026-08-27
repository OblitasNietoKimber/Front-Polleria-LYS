export default function TicketModal({ pedido, total, metodo, monto, vuelto, onClose }) {
  if (!pedido) return null;

  return (
    <div className="cart-backdrop open" onClick={onClose}>
      <div
        className="ticket-card"
        style={{ maxWidth: 380, margin: "80px auto", padding: 24, background: "var(--cream)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display" style={{ fontSize: "1.3rem", textAlign: "center" }}>
          Leñas y Sabores
        </p>
        <p className="font-mono" style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--smoke)" }}>
          Comprobante de venta
        </p>

        <div style={{ borderTop: "1px dashed var(--line)", margin: "16px 0" }} />

        <p>{pedido.id} — Mesa {pedido.mesa}</p>
        {pedido.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <span>{item.cantidad}x {item.nombre}</span>
            <span className="font-mono">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
          </div>
        ))}

        <div style={{ borderTop: "1px dashed var(--line)", margin: "16px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Total</span>
          <span className="font-mono">S/ {total.toFixed(2)}</span>
        </div>
        <p className="font-mono" style={{ fontSize: "0.8rem", marginTop: 8 }}>
          Método: {metodo} · Vuelto: S/ {vuelto.toFixed(2)}
        </p>

        <button className="btn-ember" style={{ width: "100%", marginTop: 20 }} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}