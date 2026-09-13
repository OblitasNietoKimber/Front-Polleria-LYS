import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../../components/CheckoutSteps'
import PaymentMethod from '../../components/PaymentMethod'
import { useCart } from '../../context/CartContext'
import '../../styles/compras.css'

export default function PagoPage() {
  const navigate = useNavigate()
  const { payment, setPayment } = useCart()

  return (
    <section className="checkout-page">
      <button
        onClick={() => navigate('/catalogo')}
        className="lys-navlink checkout-back-link"
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
