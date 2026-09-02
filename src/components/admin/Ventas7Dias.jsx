import { IconoGrafico } from "../common/Iconos";
import EChart from "./EChart";

const formatoSoles = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

function crearPuntos(ventas) {
  return ventas.slice(-7).map((venta) => ({
    dia: new Date(`${venta.fecha}T00:00:00`).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
    total: venta.total,
  }));
}

function crearVentasOption(puntos) {
  return {
    animationDuration: 850,
    color: ["#E23A32"],
    grid: { left: 48, right: 18, top: 18, bottom: 28 },
    tooltip: {
      trigger: "axis",
      confine: true,
      valueFormatter: (value) => formatoSoles.format(value),
      axisPointer: { type: "line", lineStyle: { color: "#E23A32", opacity: 0.35 } },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: puntos.map((punto) => punto.dia),
      axisLine: { lineStyle: { color: "#E7E2DA" } },
      axisTick: { show: false },
      axisLabel: { color: "#6E655D", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: {
        color: "#9E958C",
        fontSize: 10,
        formatter: (value) => `S/ ${value}`,
      },
      splitLine: { lineStyle: { color: "#F0EBE5", type: "dashed" } },
    },
    series: [
      {
        name: "Ventas",
        type: "line",
        data: puntos.map((punto) => punto.total),
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3 },
        areaStyle: { color: "rgba(226, 58, 50, 0.14)" },
        emphasis: { focus: "series" },
      },
    ],
  };
}

export default function Ventas7Dias({ ventas = [] }) {
  const puntos = crearPuntos(ventas);

  return (
    <section className="ticket-card admin-sales-card">
      <div className="admin-sales-head">
        <div className="admin-block-title">
          <IconoGrafico size={18} color="var(--ember)" />
          <span className="font-display">Ventas de los ultimos 7 dias</span>
        </div>

        <select className="admin-select" defaultValue="7dias">
          <option value="7dias">Ultimos 7 dias</option>
          <option value="30dias">Ultimos 30 dias</option>
        </select>
      </div>

      <div className="admin-chart-area">
        <EChart
          className="admin-line-chart"
          option={crearVentasOption(puntos)}
          ariaLabel="Grafico de ventas de los ultimos 7 dias"
        />
      </div>

      <div className="admin-chart-legend">
        <span />
        <p>{puntos.length > 0 ? "Ventas (S/)" : "Sin ventas para graficar"}</p>
      </div>
    </section>
  );
}
