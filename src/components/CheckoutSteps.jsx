export default function CheckoutSteps({ step }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
      <div className={`step-stub ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>01 · Entrega</div>
      <div className={`step-stub ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>02 · Pago</div>
      <div className={`step-stub ${step === 3 ? 'active' : ''}`}>03 · Resumen</div>
    </div>
  )
}
