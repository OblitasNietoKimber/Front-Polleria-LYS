import { Lock } from 'lucide-react'
import { BRAND_LABELS, detectCardBrand, formatCardNumber, formatCvv, formatExpiry } from '../utils/cardValidation'

export default function CardPaymentForm({ card, errors, processing, gatewayError, onChange }) {
  const digits = card.number.replace(/\D/g, '')
  const brand = detectCardBrand(digits)

  function handleNumberChange(event) {
    onChange('number', formatCardNumber(event.target.value))
  }

  function handleExpiryChange(event) {
    onChange('expiry', formatExpiry(event.target.value))
  }

  function handleCvvChange(event) {
    onChange('cvv', formatCvv(event.target.value))
  }

  return (
    <div className="card-payment-form" aria-busy={processing}>
      <div className="card-payment-head">
        <span className="card-payment-title">Datos de la tarjeta</span>
        <span className="card-payment-secure">
          <Lock size={12} /> Conexión segura
        </span>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          Número de tarjeta
          <div className="card-number-wrap">
            <input
              className={`lys-input ${errors.number ? 'err' : ''}`}
              value={card.number}
              onChange={handleNumberChange}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              disabled={processing}
              autoComplete="cc-number"
            />
            {brand && <span className="card-brand-badge">{BRAND_LABELS[brand]}</span>}
          </div>
          {errors.number && <span className="card-field-error">{errors.number}</span>}
        </label>

        <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          Nombre del titular
          <input
            className={`lys-input ${errors.name ? 'err' : ''}`}
            value={card.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="Como figura en la tarjeta"
            disabled={processing}
            autoComplete="cc-name"
          />
          {errors.name && <span className="card-field-error">{errors.name}</span>}
        </label>

        <div style={{ display: 'flex', gap: 14 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, flex: 1 }}>
            Vencimiento
            <input
              className={`lys-input ${errors.expiry ? 'err' : ''}`}
              value={card.expiry}
              onChange={handleExpiryChange}
              inputMode="numeric"
              placeholder="MM/AA"
              disabled={processing}
              autoComplete="cc-exp"
            />
            {errors.expiry && <span className="card-field-error">{errors.expiry}</span>}
          </label>

          <label style={{ fontSize: '0.82rem', fontWeight: 600, flex: 1 }}>
            CVV
            <input
              className={`lys-input ${errors.cvv ? 'err' : ''}`}
              value={card.cvv}
              onChange={handleCvvChange}
              inputMode="numeric"
              placeholder={brand === 'amex' ? '0000' : '000'}
              disabled={processing}
              autoComplete="cc-csc"
            />
            {errors.cvv && <span className="card-field-error">{errors.cvv}</span>}
          </label>
        </div>
      </div>

      {gatewayError && <div className="card-gateway-error">{gatewayError}</div>}

      {processing && (
        <div className="card-processing">
          <span className="card-spinner" /> Procesando pago con el emisor de tu tarjeta…
        </div>
      )}
    </div>
  )
}
