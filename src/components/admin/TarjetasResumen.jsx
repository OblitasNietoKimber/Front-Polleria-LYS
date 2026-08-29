import {
  IconoBilletera,
  IconoBolsaDinero,
  IconoCalendario,
  IconoGrafico,
} from "../common/Iconos";

const formatoSoles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

function crearTarjetas(resumen) {
  return [
    {
      id: 1,
      titulo: "Ventas del dia",
      monto: formatoSoles.format(resumen?.dia?.totalVentas || 0),
      comparativa: `${resumen?.dia?.cantidadPedidos || 0} pedidos pagados`,
      icono: <IconoBilletera size={18} color="var(--ember)" />,
      sparklinePoints: "0,30 30,28 60,32 90,20 120,25 150,15 180,18 210,5 240,10",
    },
    {
      id: 2,
      titulo: "Ventas de la semana",
      monto: formatoSoles.format(resumen?.semana?.totalVentas || 0),
      comparativa: `${resumen?.semana?.cantidadPedidos || 0} pedidos pagados`,
      icono: <IconoCalendario size={18} color="var(--ember)" />,
      sparklinePoints: "0,25 30,22 60,30 90,18 120,22 150,10 180,14 210,8 240,12",
    },
    {
      id: 3,
      titulo: "Ventas del mes",
      monto: formatoSoles.format(resumen?.mes?.totalVentas || 0),
      comparativa: `${resumen?.mes?.cantidadPedidos || 0} pedidos pagados`,
      icono: <IconoGrafico size={18} color="var(--ember)" />,
      sparklinePoints: "0,28 30,30 60,22 90,24 120,18 150,20 180,15 210,12 240,8",
    },
    {
      id: 4,
      titulo: "Ingresos totales",
      monto: formatoSoles.format(resumen?.total?.totalVentas || 0),
      comparativa: `${resumen?.total?.cantidadPedidos || 0} ventas realizadas`,
      icono: <IconoBolsaDinero size={18} color="var(--ember)" />,
      sparklinePoints: "0,20 30,25 60,18 90,22 120,15 150,18 180,10 210,14 240,5",
    },
  ];
}

export default function TarjetasResumen({ resumen }) {
  const tarjetas = crearTarjetas(resumen);

  return (
    <div className="admin-summary-grid">
      {tarjetas.map((tarjeta) => (
        <article key={tarjeta.id} className="ticket-card admin-summary-card">
          <div>
            <div className="admin-summary-head">
              <div className="admin-summary-icon">{tarjeta.icono}</div>
              <span className="admin-summary-title">{tarjeta.titulo}</span>
            </div>

            <div className="admin-summary-body">
              <strong className="admin-summary-amount">{tarjeta.monto}</strong>
              <span className="admin-summary-badge">{tarjeta.comparativa}</span>
            </div>
          </div>

          <div className="admin-sparkline">
            <svg viewBox="0 0 240 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`grad-${tarjeta.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
                </linearGradient>
              </defs>

              <polygon points={`0,40 ${tarjeta.sparklinePoints} 240,40`} fill={`url(#grad-${tarjeta.id})`} />
              <polyline
                fill="none"
                stroke="var(--ember)"
                strokeLinecap="round"
                strokeWidth="2.5"
                points={tarjeta.sparklinePoints}
              />
            </svg>
          </div>
        </article>
      ))}
    </div>
  );
}
