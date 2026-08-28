export default function ColumnaPedidos({ titulo, color, pedidos, children }) {
  return (
    <div style={{ flex: 1, minWidth: 280 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <h3 className="font-display" style={{ fontSize: "1.1rem" }}>{titulo}</h3>
        <span className="chip">{pedidos.length}</span>
      </div>

      {pedidos.length === 0 ? (
        <p className="font-mono" style={{ color: "var(--smoke)", fontSize: "0.85rem" }}>
          Sin pedidos
        </p>
      ) : (
        children
      )}
    </div>
  );
}