import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function CatalogoPage() {
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 20px 80px' }}>
      <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 4 }}>
        Nuestro menú
      </h1>
      <p style={{ color: 'var(--smoke)', marginBottom: 28 }}>Elige tus platos y arma tu pedido.</p>

      {/* La búsqueda y los filtros por categoría se agregan en el siguiente commit. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
