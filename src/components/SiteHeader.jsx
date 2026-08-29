import { Flame, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function SiteHeader() {
  const { cartCount, openCart } = useCart()

  return (
    <nav className="lys-nav">
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <NavLink
          to="/"
          style={{
            background: 'none',
            border: 'none',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span className="lys-logo-badge">
            <Flame size={19} color="var(--ember)" strokeWidth={2} />
          </span>
          <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ember)' }}>
            Leña y Sabores
          </span>
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <NavLink to="/" end className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Menú
          </NavLink>
          <NavLink to="/pedidos" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Mis pedidos
          </NavLink>
          <button
            type="button"
            onClick={openCart}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Ver carrito"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="badge-count" style={{ position: 'absolute', top: -8, right: -10 }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
