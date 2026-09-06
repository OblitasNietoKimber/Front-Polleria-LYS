export default function ColumnaPedidos({ titulo, colorClase, pedidos, children }) {
  return (
    <div className="cocina-column">
      <div className="cocina-column-header">
        <span className={`cocina-dot ${colorClase}`} />
        <h3 className="font-display" style={{ fontSize: "1.1rem", margin: 0 }}>{titulo}</h3>
        <span className="cocina-count">{pedidos.length}</span>
      </div>

      {pedidos.length === 0 ? (
        <p className="cocina-empty">Sin pedidos</p>
      ) : (
        children
      )}
    </div>
  );
}