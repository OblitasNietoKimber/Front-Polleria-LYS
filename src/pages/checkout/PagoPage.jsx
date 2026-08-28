import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../../components/CheckoutSteps'
import PaymentMethod from '../../components/PaymentMethod'
import { useCart } from '../../context/CartContext'

export default function PagoPage() {
  const navigate = useNavigate()
  const { payment, setPayment } = useCart()

  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px 100px' }}>
      <button
        onClick={() => navigate('/catalogo')}
        className="lys-navlink"
        style={{ color: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22 }}
      >
        <ArrowLeft size={15} /> Seguir comprando
      </button>

      <CheckoutSteps step={2} />

      <PaymentMethod
        payment={payment}
        onChange={setPayment}
        onBack={() => navigate('/checkout/entrega')}
        onContinue={() => navigate('/checkout/resumen')}
      />
    </section>
  )
}
