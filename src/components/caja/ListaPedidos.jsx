export default function ListaPedidos({ pedidos, pedidoSeleccionado, onSeleccionar }) {
  if (pedidos.length === 0) {
    return <p className="font-mono caja-empty-state">No hay pedidos pendientes.</p>;
  }

  return (
    <div className="caja-list">
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className={`ticket-card caja-item ${pedidoSeleccionado === pedido.id ? "caja-item-selected" : ""}`}
          onClick={() => onSeleccionar(pedido.id)}
        >
          <div className="caja-item-top">
            <div className="caja-item-meta">
              <p className="caja-item-cliente">{pedido.cliente}</p>
              <p className="font-mono caja-item-id">{pedido.id}</p>
            </div>
            <span className="chip active">Mesa {pedido.mesa}</span>
          </div>
        </div>
      ))}
    </div>
  );
}