import { CheckCircle2 } from 'lucide-react'

export default function OrderConfirmation({ name, orderNumber, onReset }) {
  return (
    <section style={{ maxWidth: 560, margin: '0 auto', padding: '80px 20px 100px', textAlign: 'center' }}>
      <CheckCircle2 size={54} color="var(--ember)" strokeWidth={1.5} style={{ marginBottom: 18 }} />
      <h1 className="font-display" style={{ fontSize: '1.9rem', fontWeight: 600, marginBottom: 10 }}>
        ¡Pedido confirmado!
      </h1>
      <p style={{ color: 'var(--smoke)', marginBottom: 24 }}>
        Gracias, {name || 'cliente'}. Ya empezamos a preparar tu pedido a la leña.
      </p>
      <div className="font-mono" style={{ display: 'inline-block', border: '1.5px dashed var(--ember)', padding: '14px 28px', marginBottom: 30 }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--smoke)', letterSpacing: '0.1em' }}>NÚMERO DE PEDIDO</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--rust)' }}>{orderNumber}</div>
      </div>
      <div>
        <button className="btn-ember" onClick={onReset}>
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
