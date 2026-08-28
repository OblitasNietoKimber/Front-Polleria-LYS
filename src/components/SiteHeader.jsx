import { Flame, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function SiteHeader() {
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
          {/* El contador y la acción de abrir el carrito se conectan al CartContext en un commit posterior. */}
          <button
            type="button"
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
          </button>
        </div>
      </div>
    </nav>
  )
}
