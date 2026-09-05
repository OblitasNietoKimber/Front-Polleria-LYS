import { Flame, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function SiteHeader() {
  const { cartCount, openCart } = useCart()

  return (
    <nav className="lys-nav">
      <div className="lys-nav-inner">
        <NavLink
          to="/"
          className="lys-brand-link"
        >
          <span className="lys-logo-badge">
            <Flame size={19} color="var(--ember)" strokeWidth={2} />
          </span>
          <span className="font-display lys-brand-title">
            Leña y Sabores
          </span>
        </NavLink>

        <div className="lys-navlinks">
          <NavLink to="/" end className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Menú
          </NavLink>
          <NavLink to="/pedidos" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Mis pedidos
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/caja" className={({ isActive }) => `lys-navlink ${isActive ? 'active' : ''}`}>
            Caja
          </NavLink>
          <button
            type="button"
            onClick={openCart}
            className="lys-cart-button"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="badge-count lys-cart-count">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
