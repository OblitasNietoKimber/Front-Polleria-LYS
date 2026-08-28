import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../../components/CheckoutSteps'
import OrderSummary from '../../components/OrderSummary'
import { useCart } from '../../context/CartContext'
import { money } from '../../utils/currency'

export default function ResumenPage() {
  const navigate = useNavigate()
  const { cartItems, subtotal, shipping, total, deliveryType, form, payment, confirmOrder } = useCart()

  function handleConfirm() {
    confirmOrder()
    navigate('/confirmacion')
  }

  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px 100px' }}>
      <button
        onClick={() => navigate('/catalogo')}
        className="lys-navlink"
        style={{ color: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22 }}
      >
        <ArrowLeft size={15} /> Seguir comprando
      </button>

      <CheckoutSteps step={3} />

      <OrderSummary
        items={cartItems}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        deliveryType={deliveryType}
        form={form}
        payment={payment}
        money={money}
        onBack={() => navigate('/checkout/pago')}
        onConfirm={handleConfirm}
      />
    </section>
  )
}
