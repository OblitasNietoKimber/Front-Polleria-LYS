export default function CajaPage() {
  return (
    <div className="lys-root" style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: 24 }}>
        Caja
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div>
          <p className="font-mono" style={{ color: "var(--smoke)" }}>
            Pedidos pendientes de pago
          </p>
        </div>

        <div className="ticket-card" style={{ padding: 20 }}>
          <p className="font-mono" style={{ color: "var(--smoke)" }}>
            Selecciona un pedido para ver el detalle
          </p>
        </div>
      </div>
    </div>
  );
}