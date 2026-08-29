import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <header
        style={{
          background: 'var(--char)',
          color: 'var(--cream)',
          padding: '70px 20px 90px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'var(--gold)',
              color: '#2A1B05',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            <Flame size={14} strokeWidth={2.4} /> Pollería a la leña
          </div>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.05, fontWeight: 600, margin: '0 0 20px' }}
          >
            El sabor que solo <em style={{ color: 'var(--ember)', fontStyle: 'italic' }}>da la leña</em>.
          </h1>
          <p style={{ color: '#C7C2BB', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 34px', lineHeight: 1.6 }}>
            Pollos y parrillas cocinados a fuego de leña, con la receta de siempre. Pide online y recíbelo en tu
            mesa o en tu puerta.
          </p>
          <button className="btn-ember" onClick={() => navigate('/catalogo')}>
            Ver el menú completo
          </button>
        </div>
      </header>

      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 600 }}>
            Nuestras categorías
          </h2>
          <button onClick={() => navigate('/catalogo')} className="lys-navlink" style={{ color: 'var(--rust)' }}>
            Ver todo →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/catalogo?categoria=${c.id}`)}
              className="ticket-card"
              style={{ textAlign: 'left', padding: 0, border: '1px solid var(--line)' }}
            >
              <div className="icon-tile" style={{ aspectRatio: '3/2' }}>
                <c.icon size={34} strokeWidth={1.5} />
              </div>
              <div style={{ padding: '16px 16px 20px' }}>
                <div className="font-display" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
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
