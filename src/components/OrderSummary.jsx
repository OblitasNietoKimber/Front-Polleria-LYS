export default function OrderSummary({ items, subtotal, shipping, total, deliveryType, form, payment, money, onBack, onConfirm }) {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 18 }}>
        Resumen de tu compra
      </h2>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
        <div
          style={{
            background: 'var(--char)',
            color: 'var(--cream)',
            padding: '14px 18px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
          }}
        >
          COMANDA · LEÑAS &amp; SABORES
        </div>
        <div style={{ padding: '18px' }}>
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="font-mono"
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px dashed var(--line)' }}
            >
              <span>
                {qty}× {product.name}
              </span>
              <span>{money(qty * product.price)}</span>
            </div>
          ))}
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '10px 0 4px' }}>
            <span style={{ color: 'var(--smoke)' }}>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0' }}>
            <span style={{ color: 'var(--smoke)' }}>Envío ({deliveryType === 'delivery' ? 'delivery' : 'recojo en tienda'})</span>
            <span>{shipping === 0 ? 'Gratis' : money(shipping)}</span>
          </div>
          <div
            className="font-mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '12px 0 0',
              borderTop: '1.5px solid var(--ink)',
              marginTop: 8,
              color: 'var(--rust)',
            }}
          >
            <span>TOTAL</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: '0.85rem', color: 'var(--smoke)', lineHeight: 1.7 }}>
        <div>
          <strong style={{ color: 'var(--ink)' }}>Entrega:</strong> {form.name} · {form.phone}
        </div>
        <div>{deliveryType === 'delivery' ? `${form.address}${form.reference ? ` (${form.reference})` : ''}` : 'Recojo en tienda'}</div>
        <div>
          <strong style={{ color: 'var(--ink)' }}>Pago:</strong>{' '}
          {payment === 'efectivo' ? 'Efectivo' : payment === 'tarjeta' ? 'Tarjeta' : 'Yape / Plin'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onBack}>
          Atrás
        </button>
        <button className="btn-ember" style={{ flex: 2 }} onClick={onConfirm}>
          Confirmar pedido
        </button>
      </div>
    </div>
  )
}
