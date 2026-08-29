import { IconoCheckCirculo, IconoReloj } from "../common/Iconos";

function tiempoTranscurrido(fechaISO) {
  const minutos = Math.floor((Date.now() - new Date(fechaISO).getTime()) / 60000);
  if (minutos < 1) return { texto: "Recién llegado", alerta: false };
  if (minutos === 1) return { texto: "Hace 1 min", alerta: false };
  return { texto: `Hace ${minutos} min`, alerta: minutos >= 12 };
}

const ESTADO_CLASE = {
  nuevo: "cocina-card--nuevo",
  en_preparacion: "cocina-card--preparacion",
  listo: "cocina-card--listo",
};

export default function TarjetaPedidoCocina({ pedido, onCambiarEstado }) {
  const tiempo = tiempoTranscurrido(pedido.createdAt);

  return (
    <div className={`cocina-card ${ESTADO_CLASE[pedido.estadoCocina] || ""}`}>
      <div className="cocina-card-top">
        <div>
          <p style={{ fontWeight: 700, margin: 0 }}>{pedido.cliente}</p>
          <span className="cocina-id">{pedido.id}</span>
        </div>
        <span className="cocina-mesa-chip">Mesa {pedido.mesa}</span>
      </div>

      {pedido.observaciones && (
        <p className="cocina-obs-general">Obs: {pedido.observaciones}</p>
      )}

      <ul className="cocina-items">
        {pedido.items.map((item, i) => (
          <li key={i}>
            <span className="cocina-cant">{item.cantidad}x</span>
            <span>
              {item.nombre}
              {item.observacion && <span className="cocina-obs-item"> — {item.observacion}</span>}
            </span>
          </li>
        ))}
      </ul>

      <div className="cocina-card-footer">
        <span className={`cocina-timer ${tiempo.alerta ? "cocina-timer--alerta" : ""}`}>
          <IconoReloj size={13} /> {tiempo.texto}
        </span>

        {pedido.estadoCocina === "nuevo" && (
          <button className="cocina-btn cocina-btn--iniciar" onClick={() => onCambiarEstado(pedido.id, "en_preparacion")}>
            Iniciar preparación
          </button>
        )}
        {pedido.estadoCocina === "en_preparacion" && (
          <button className="cocina-btn cocina-btn--listo" onClick={() => onCambiarEstado(pedido.id, "listo")}>
            Marcar como listo
          </button>
        )}
        {pedido.estadoCocina === "listo" && (
          <button className="cocina-btn cocina-btn--entregar" onClick={() => onCambiarEstado(pedido.id, "entregado")}>
            <IconoCheckCirculo size={13} /> Entregar
          </button>
        )}
      </div>
    </div>
  );
}