import { X } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { money } from '../utils/currency'

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(27,21,18,0.5)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--paper)', maxWidth: 440, width: '100%', overflow: 'hidden', position: 'relative' }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            zIndex: 2,
          }}
          aria-label="Cerrar detalle del producto"
        >
          <X size={16} />
        </button>
        <div className="icon-tile" style={{ aspectRatio: '16/9' }}>
          <CategoryIcon id={product.category} size={56} />
        </div>
        <div style={{ padding: 24 }}>
          {!product.available && (
            <span className="font-mono" style={{ fontSize: '0.7rem', color: '#B23A2E', fontWeight: 700 }}>
              NO DISPONIBLE
            </span>
          )}
          <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 600, margin: '6px 0 10px' }}>
            {product.name}
          </h3>
          <p style={{ color: 'var(--smoke)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 18 }}>
            {product.desc}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--rust)' }}>
              {money(product.price)}
            </span>
            {/* El botón se conecta al carrito de compras en un commit posterior. */}
            <button className="btn-ember" disabled={!product.available}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
