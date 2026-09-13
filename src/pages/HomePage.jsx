import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import '../styles/home.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <header className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-badge">
            <Flame size={14} strokeWidth={2.4} /> Pollería a la leña
          </div>
          <h1 className="font-display home-hero-title">
            El sabor que solo <em className="home-hero-highlight">da la leña</em>.
          </h1>
          <p className="home-hero-text">
            Pollos y parrillas cocinados a fuego de leña, con la receta de siempre. Pide online y recíbelo en tu
            mesa o en tu puerta.
          </p>
          <button className="btn-ember" onClick={() => navigate('/catalogo')}>
            Ver el menú completo
          </button>
        </div>
      </header>

      <section className="home-categories">
        <div className="home-categories-head">
          <h2 className="font-display home-categories-title">
            Nuestras categorías
          </h2>
          <button onClick={() => navigate('/catalogo')} className="lys-navlink home-categories-link">
            Ver todo →
          </button>
        </div>
        <div className="home-categories-grid">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/catalogo?categoria=${c.id}`)}
              className="ticket-card home-category-card"
            >
              <div className="icon-tile home-category-icon">
                <c.icon size={34} strokeWidth={1.5} />
              </div>
              <div className="home-category-body">
                <div className="font-display home-category-label">
                  {c.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
