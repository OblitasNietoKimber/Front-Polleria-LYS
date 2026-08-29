import { CreditCard, Smartphone, Wallet } from 'lucide-react'

const METHODS = [
  { id: 'efectivo', label: 'Efectivo', desc: 'Pagas al recibir tu pedido.', icon: Wallet },
  { id: 'tarjeta', label: 'Tarjeta', desc: 'Débito o crédito, contra entrega o en tienda.', icon: CreditCard },
  { id: 'yape', label: 'Yape / Plin', desc: 'Pago digital mediante QR.', icon: Smartphone },
]

export default function PaymentMethod({ payment, onChange, onBack, onContinue }) {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 18 }}>
        Método de pago
      </h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              padding: '16px 18px',
              borderRadius: 4,
              cursor: 'pointer',
              border: payment === method.id ? '1.5px solid var(--ember)' : '1.5px solid var(--line)',
              background: payment === method.id ? '#FCEDE5' : 'var(--paper)',
              transition: 'all .15s ease',
            }}
          >
            <method.icon size={22} color={payment === method.id ? 'var(--ember)' : 'var(--smoke)'} strokeWidth={1.7} />
            <div>
              <div style={{ fontWeight: 600 }}>{method.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--smoke)' }}>{method.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onBack}>
          Atrás
        </button>
        <button className="btn-ember" style={{ flex: 2 }} disabled={!payment} onClick={onContinue}>
          Ver resumen
        </button>
      </div>
    </div>
  )
}
