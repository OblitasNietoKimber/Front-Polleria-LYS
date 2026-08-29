import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../../components/CheckoutSteps'
import DeliveryForm from '../../components/DeliveryForm'
import { useCart } from '../../context/CartContext'

export default function EntregaPage() {
  const navigate = useNavigate()
  const { deliveryType, setDeliveryType, form, updateFormField } = useCart()
  const [errors, setErrors] = useState({})

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Ingresa tu nombre.'
    if (!form.phone.trim()) nextErrors.phone = 'Ingresa un teléfono de contacto.'
    if (deliveryType === 'delivery' && !form.address.trim()) nextErrors.address = 'Ingresa tu dirección.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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

      <CheckoutSteps step={1} />

      <DeliveryForm
        deliveryType={deliveryType}
        form={form}
        errors={errors}
        onTypeChange={setDeliveryType}
        onFormChange={updateFormField}
        onContinue={() => {
          if (validate()) navigate('/checkout/pago')
        }}
      />
    </section>
  )
}
