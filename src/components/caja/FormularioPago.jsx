const METODOS = ["Efectivo", "Yape/Plin", "Tarjeta"];

export default function FormularioPago({ metodo, onMetodoChange, monto, onMontoChange }) {
  return (
    <div className="caja-payment">
      <p className="font-mono caja-label">Método de pago</p>
      <div className="caja-metodos">
        {METODOS.map((m) => (
          <button
            key={m}
            className={`chip ${metodo === m ? "active" : ""}`}
            onClick={() => onMetodoChange(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="font-mono caja-label">Monto recibido</p>
      <input
        className="lys-input"
        type="number"
        min="0"
        max="10000"
        step="0.10"
        placeholder="S/ 0.00"
        value={monto}
        onChange={(e) => {
          const valor = e.target.value;
          if (valor === "" || parseFloat(valor) <= 10000) {
            onMontoChange(e.target.value);
          }
        }}
      />
    </div>
  );
}