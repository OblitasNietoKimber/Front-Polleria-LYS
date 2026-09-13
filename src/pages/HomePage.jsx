import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import '../styles/home.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <header className="home-simple-hero">
        <div className="home-simple-hero-inner">
          <div className="home-simple-badge">
            <Flame size={14} strokeWidth={2.4} /> Pollería a la leña
          </div>
          <h1 className="font-display home-simple-title">
            El sabor que solo <em className="home-simple-title-accent">da la leña</em>.
          </h1>
          <p className="home-simple-subtitle">
            Pollos y parrillas cocinados a fuego de leña, con la receta de siempre. Pide online y recíbelo en tu
            mesa o en tu puerta.
          </p>
          <button className="btn-ember" onClick={() => navigate('/catalogo')}>
            Ver el menú completo
          </button>
        </div>
      </header>

      <section className="home-simple-categories">
        <div className="home-simple-categories-head">
          <h2 className="font-display home-simple-categories-title">
            Nuestras categorías
          </h2>
          <button onClick={() => navigate('/catalogo')} className="lys-navlink home-simple-categories-link">
            Ver todo →
          </button>
        </div>
        <div className="home-simple-categories-grid">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/catalogo?categoria=${c.id}`)}
              className="ticket-card home-simple-category-btn"
            >
              <div className="icon-tile home-simple-category-icon">
                <c.icon size={34} strokeWidth={1.5} />
              </div>
              <div className="home-simple-category-body">
                <div className="font-display home-simple-category-label">
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
