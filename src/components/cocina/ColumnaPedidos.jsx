export default function ColumnaPedidos({ titulo, variante, icono: Icono, pedidos, children }) {
  return (
    <div className="cocina-column">
      <div className="cocina-column-header">
        <Icono size={17} className={`cocina-column-icono cocina-column-icono--${variante}`} />
        <h3 className="font-display" style={{ fontSize: "1.05rem", margin: 0 }}>{titulo}</h3>
        <span className={`cocina-count cocina-count--${variante}`}>{pedidos.length}</span>
      </div>

      <div className="cocina-column-body">
        {pedidos.length === 0 ? <p className="cocina-empty">Sin pedidos</p> : children}
      </div>
    </div>
  );
}