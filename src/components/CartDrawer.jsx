import { Trash2, X } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { cartOpen, closeCart, cartItems, removeItem } = useCart()

  return (
    <>
      <div className={`cart-backdrop ${cartOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Tu carrito
          </span>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--smoke)', padding: '50px 0', fontSize: '0.9rem' }}>
              Aún no agregaste platos.
            </div>
          ) : (
            cartItems.map(({ product, qty }) => (
              <div
                key={product.id}
                style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px dashed var(--line)' }}
              >
                <div className="icon-tile" style={{ width: 56, height: 56, aspectRatio: 'unset', flexShrink: 0 }}>
                  <CategoryIcon id={product.category} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{product.name}</div>
                  <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--rust)', margin: '4px 0 8px' }}>
                    Cantidad: {qty}
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--smoke)', padding: 0 }}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  )
}
