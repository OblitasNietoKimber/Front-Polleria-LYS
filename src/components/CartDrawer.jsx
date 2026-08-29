import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CategoryIcon from './CategoryIcon'
import { useCart } from '../context/CartContext'
import { money } from '../utils/currency'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { cartOpen, closeCart, cartItems, removeItem, setQty, subtotal } = useCart()

  function handleCheckout() {
    closeCart()
    navigate('/checkout/entrega')
  }

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 0' }}>
                    <button className="qty-btn" onClick={() => setQty(product.id, qty - 1)} aria-label="Reducir cantidad">
                      <Minus size={13} />
                    </button>
                    <span className="font-mono" style={{ minWidth: 18, textAlign: 'center', fontSize: '0.9rem' }}>
                      {qty}
                    </span>
                    <button className="qty-btn" onClick={() => setQty(product.id, qty + 1)} aria-label="Aumentar cantidad">
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--smoke)' }}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div style={{ padding: '18px 20px', borderTop: '1px solid var(--line)' }}>
            <div
              className="font-mono"
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <button className="btn-ember" style={{ width: '100%', marginTop: 14 }} onClick={handleCheckout}>
              Continuar compra
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
