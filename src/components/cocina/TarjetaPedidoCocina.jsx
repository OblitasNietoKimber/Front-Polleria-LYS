import { IconoCheckCirculo, IconoReloj } from "../common/Iconos";

function tiempoTranscurrido(fechaISO) {
  const minutos = Math.floor((Date.now() - new Date(fechaISO).getTime()) / 60000);
  if (minutos < 1) return "Recién llegado";
  if (minutos === 1) return "Hace 1 min";
  return `Hace ${minutos} min`;
}

export default function TarjetaPedidoCocina({ pedido, onCambiarEstado }) {
  return (
    <div className="ticket-card" style={{ padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontWeight: 600 }}>{pedido.cliente}</p>
          <p className="font-mono" style={{ fontSize: "0.78rem", color: "var(--smoke)" }}>
            {pedido.id}
          </p>
        </div>
        <span className="chip active">Mesa {pedido.mesa}</span>
      </div>

      <ul style={{ marginTop: 10, paddingLeft: 18 }}>
        {pedido.items.map((item, i) => (
          <li key={i} style={{ fontSize: "0.9rem" }}>
            {item.cantidad}x {item.nombre}
            {item.observacion && (
              <span style={{ color: "var(--ember)", fontStyle: "italic" }}> — {item.observacion}</span>
            )}
          </li>
        ))}
      </ul>

      {pedido.observaciones && (
        <p style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--rust)" }}>
          Obs: {pedido.observaciones}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <span
          className="font-mono"
          style={{ fontSize: "0.75rem", color: "var(--smoke)", display: "flex", alignItems: "center", gap: 4 }}
        >
          <IconoReloj size={14} /> {tiempoTranscurrido(pedido.createdAt)}
        </span>

        {pedido.estadoCocina === "nuevo" && (
          <button className="btn-ember" onClick={() => onCambiarEstado(pedido.id, "en_preparacion")}>
            Iniciar preparación
          </button>
        )}
        {pedido.estadoCocina === "en_preparacion" && (
          <button className="btn-ember" onClick={() => onCambiarEstado(pedido.id, "listo")}>
            Marcar como listo
          </button>
        )}
        {pedido.estadoCocina === "listo" && (
          <button
            className="btn-outline"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => onCambiarEstado(pedido.id, "entregado")}
          >
            <IconoCheckCirculo size={14} /> Entregar
          </button>
        )}
      </div>
    </div>
  );
}