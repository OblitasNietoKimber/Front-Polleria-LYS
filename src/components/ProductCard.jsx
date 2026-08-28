import CategoryIcon from './CategoryIcon'
import { money } from '../utils/currency'

export default function ProductCard({ product, onSelect }) {
  return (
    <div className="ticket-card" onClick={() => onSelect?.(product)}>
      <div className="icon-tile" style={{ opacity: product.available ? 1 : 0.4 }}>
        <CategoryIcon id={product.category} size={40} />
      </div>
      <div style={{ padding: '16px' }}>
        {!product.available && (
          <span
            className="font-mono"
            style={{ fontSize: '0.68rem', color: '#B23A2E', fontWeight: 700, letterSpacing: '0.05em' }}
          >
            NO DISPONIBLE
          </span>
        )}
        <div
          className="font-display"
          style={{ fontWeight: 600, fontSize: '1.05rem', margin: '6px 0 6px', opacity: product.available ? 1 : 0.55 }}
        >
          {product.name}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--smoke)', lineHeight: 1.5, marginBottom: 14, minHeight: 40 }}>
          {product.desc.slice(0, 70)}
          {product.desc.length > 70 ? '…' : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="font-mono" style={{ fontWeight: 600, color: 'var(--rust)', fontSize: '0.98rem' }}>
            {money(product.price)}
          </span>
          {/* El botón se conecta al carrito de compras en un commit posterior. */}
          <button
            className="btn-outline"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
            disabled={!product.available}
            onClick={(event) => event.stopPropagation()}
          >
            {product.available ? 'Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  )
}
