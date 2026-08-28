import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import { PRODUCTS } from '../data/products'
import { filterProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('categoria') || 'todos'
  const search = searchParams.get('buscar') || ''

  const filteredProducts = filterProducts(PRODUCTS, { category: activeCategory, search })

  function updateParams(next) {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'todos') params.delete(key)
      else params.set(key, value)
    })
    setSearchParams(params)
  }

  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 20px 80px' }}>
      <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 4 }}>
        Nuestro menú
      </h1>
      <p style={{ color: 'var(--smoke)', marginBottom: 28 }}>Elige tus platos y arma tu pedido.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 220 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--smoke)' }}
          />
          <input
            className="lys-input"
            style={{ paddingLeft: 36 }}
            placeholder="Buscar un plato..."
            value={search}
            onChange={(event) => updateParams({ buscar: event.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, marginBottom: 30 }}>
        <button
          className={`chip ${activeCategory === 'todos' ? 'active' : ''}`}
          onClick={() => updateParams({ categoria: 'todos' })}
        >
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`chip ${activeCategory === c.id ? 'active' : ''}`}
            onClick={() => updateParams({ categoria: c.id })}
          >
            <c.icon size={14} strokeWidth={2} /> {c.label}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--smoke)' }}>
          No encontramos platos que coincidan con tu búsqueda.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
