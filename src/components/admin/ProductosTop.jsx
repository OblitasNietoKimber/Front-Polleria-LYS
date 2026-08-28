import { IconoBolsa } from "../common/Iconos";

const imagenProducto = "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=100&auto=format&fit=crop&q=80";
const formatoSoles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

function prepararProductos(productos) {
  const totalGeneral = productos.reduce((acc, item) => acc + item.total, 0);

  return productos.slice(0, 5).map((item, index) => {
    const pct = totalGeneral ? Number(((item.total / totalGeneral) * 100).toFixed(1)) : 0;

    return {
      ...item,
      num: index + 1,
      pct,
      imagen: imagenProducto,
      totalFormateado: formatoSoles.format(item.total),
      ancho: `${Math.max(18, Math.round(pct * 2))}px`,
    };
  });
}

export default function ProductosTop({ productos = [] }) {
  const productosTop = prepararProductos(productos);

  return (
    <section className="ticket-card admin-products-card">
      <div className="admin-block-title">
        <IconoBolsa size={18} color="var(--ember)" />
        <span className="font-display">Productos mas vendidos</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Cantidad vendida</th>
              <th>Total generado</th>
              <th>Participacion</th>
            </tr>
          </thead>
          <tbody>
            {productosTop.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-empty-cell">No hay productos vendidos registrados.</td>
              </tr>
            ) : productosTop.map((item) => (
              <tr key={item.num}>
                <td className="font-mono">{item.num}</td>
                <td>
                  <div className="admin-product-cell">
                    <img src={item.imagen} alt={item.nombre} className="admin-product-img" />
                    <span>{item.nombre}</span>
                  </div>
                </td>
                <td className="font-mono">{item.cantidad}</td>
                <td className="font-mono">{item.totalFormateado}</td>
                <td>
                  <div className="admin-participation">
                    <span className="admin-pill-bar" style={{ width: item.ancho }} />
                    <span className="font-mono">{item.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}