import {
  IconoCheckCirculo,
  IconoGrafico,
  IconoReloj,
  IconoTendencia,
  IconoXCirculo,
} from "../common/Iconos";

const formatoSoles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

function crearMetricas(resumen, pedidosPendientes) {
  return [
    {
      id: "completados",
      etiqueta: "Pedidos completados",
      valor: `${resumen?.total?.cantidadPedidos || 0}`,
      comparativa: `${resumen?.dia?.cantidadPedidos || 0} completados hoy`,
      claseIcono: "green",
      colorBarra: "#2E7D32",
      icono: <IconoCheckCirculo size={16} />,
      barras: [40, 55, 60, 45, 70, 85, 90, 80, 100, 95],
    },
    {
      id: "pendientes",
      etiqueta: "Pedidos pendientes",
      valor: `${pedidosPendientes}`,
      comparativa: "Pendientes por cobrar",
      claseIcono: "yellow",
      colorBarra: "#E8A33D",
      icono: <IconoReloj size={16} />,
      barras: [30, 45, 20, 60, 50, 70, 40, 65, 80, 75],
    },
    {
      id: "cancelados",
      etiqueta: "Pedidos cancelados",
      valor: "0",
      comparativa: "Sin cancelaciones registradas",
      claseIcono: "red",
      colorBarra: "#E23A32",
      icono: <IconoXCirculo size={16} />,
      barras: [20, 30, 45, 25, 60, 40, 50, 30, 20, 35],
    },
    {
      id: "ventas",
      etiqueta: "Total ventas realizadas",
      valor: formatoSoles.format(resumen?.total?.totalVentas || 0),
      comparativa: `${resumen?.semana?.cantidadPedidos || 0} ventas esta semana`,
      claseIcono: "blue",
      colorBarra: "#1565C0",
      icono: <IconoGrafico size={16} />,
      barras: [50, 60, 55, 70, 65, 80, 85, 90, 95, 100],
    },
  ];
}

export default function MetricasOperativas({ resumen, pedidosPendientes = 0 }) {
  const metricas = crearMetricas(resumen, pedidosPendientes);

  return (
    <section className="ticket-card admin-ops-card">
      <div className="admin-block-title">
        <IconoTendencia size={18} color="var(--ember)" />
        <span className="font-display">Metricas operativas</span>
      </div>

      <div className="admin-ops-grid">
        {metricas.map((metrica) => (
          <article className="admin-mini-card" key={metrica.id}>
            <div className="admin-mini-head">
              <div className={`admin-mini-icon ${metrica.claseIcono}`}>
                {metrica.icono}
              </div>

              <div className="admin-mini-info">
                <span className="admin-mini-label">{metrica.etiqueta}</span>
                <strong className="admin-mini-value">{metrica.valor}</strong>
                <span className={`admin-mini-trend ${metrica.claseIcono}`}>
                  {metrica.comparativa}
                </span>
              </div>
            </div>

            <div className="admin-mini-bars">
              {metrica.barras.map((alto, index) => (
                <span
                  key={index}
                  className="admin-mini-bar"
                  style={{ height: `${alto}%`, backgroundColor: metrica.colorBarra }}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}