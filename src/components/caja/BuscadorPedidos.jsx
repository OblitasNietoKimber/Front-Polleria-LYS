export default function BuscadorPedidos({ valor, onChange }) {
  return (
    <input
      className="lys-input caja-search"
      type="text"
      placeholder="Buscar por N° de pedido o mesa..."
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}