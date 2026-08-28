import { MapPin, Store } from 'lucide-react'

export default function DeliveryForm({ deliveryType, form, errors, onTypeChange, onFormChange, onContinue }) {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 18 }}>
        Datos de entrega
      </h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <button
          onClick={() => onTypeChange('delivery')}
          className={`chip ${deliveryType === 'delivery' ? 'active' : ''}`}
          style={{ padding: '12px 18px', fontSize: '0.88rem' }}
        >
          <MapPin size={16} /> Delivery
        </button>
        <button
          onClick={() => onTypeChange('pickup')}
          className={`chip ${deliveryType === 'pickup' ? 'active' : ''}`}
          style={{ padding: '12px 18px', fontSize: '0.88rem' }}
        >
          <Store size={16} /> Recojo en tienda
        </button>
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          Nombre completo
          <input
            className={`lys-input ${errors.name ? 'err' : ''}`}
            value={form.name}
            onChange={(event) => onFormChange('name', event.target.value)}
            placeholder="Ej. María Torres"
          />
          {errors.name && <span style={{ color: '#B23A2E', fontSize: '0.75rem' }}>{errors.name}</span>}
        </label>
        {deliveryType === 'delivery' && (
          <>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Dirección de entrega
              <input
                className={`lys-input ${errors.address ? 'err' : ''}`}
                value={form.address}
                onChange={(event) => onFormChange('address', event.target.value)}
                placeholder="Av. Ejemplo 123, distrito"
              />
              {errors.address && <span style={{ color: '#B23A2E', fontSize: '0.75rem' }}>{errors.address}</span>}
            </label>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Referencia (opcional)
              <input
                className="lys-input"
                value={form.reference}
                onChange={(event) => onFormChange('reference', event.target.value)}
                placeholder="Ej. frente al parque, edificio azul"
              />
            </label>
          </>
        )}
        <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          Teléfono de contacto
          <input
            className={`lys-input ${errors.phone ? 'err' : ''}`}
            value={form.phone}
            onChange={(event) => onFormChange('phone', event.target.value)}
            placeholder="9XX XXX XXX"
          />
          {errors.phone && <span style={{ color: '#B23A2E', fontSize: '0.75rem' }}>{errors.phone}</span>}
        </label>
      </div>
      <button className="btn-ember" style={{ marginTop: 26, width: '100%' }} onClick={onContinue}>
        Continuar al pago
      </button>
    </div>
  )
}
