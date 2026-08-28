const STORAGE_KEY = "lys_pedidos";

// Datos de prueba iniciales
const seedPedidos = [
  {
    id: "PED-1001",
    mesa: 4,
    cliente: "Mesa 4",
    estado: "pendiente",
    items: [
      { nombre: "Pollo a la brasa 1/4", cantidad: 2, precio: 22.5 },
      { nombre: "Gaseosa 1.5L", cantidad: 1, precio: 9.0 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "PED-1002",
    mesa: 7,
    cliente: "Mesa 7",
    estado: "pendiente",
    items: [
      { nombre: "Pollo entero", cantidad: 1, precio: 68.0 },
      { nombre: "Papas extra", cantidad: 2, precio: 8.5 },
    ],
    createdAt: new Date().toISOString(),
  },
];

function inicializar() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPedidos));
  }
}

function getPedidos() {
  inicializar();
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function getPedidosPendientes() {
  return getPedidos().filter((p) => p.estado === "pendiente");
}

function getPedidoPorId(id) {
  return getPedidos().find((p) => p.id === id) || null;
}

function calcularTotal(pedido) {
  return pedido.items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
}

function marcarComoPagado(id, dataPago) {
  const pedidos = getPedidos();
  const actualizados = pedidos.map((p) =>
    p.id === id
      ? { ...p, estado: "pagado", pago: dataPago, pagadoAt: new Date().toISOString() }
      : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  return actualizados.find((p) => p.id === id);
}

function getVentas() {
  return getPedidos().filter((p) => p.estado === "pagado");
}

function getFechaVenta(venta) {
  return new Date(venta.pagadoAt || venta.createdAt);
}

function inicioDelDia(fecha) {
  const copia = new Date(fecha);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function finDelDia(fecha) {
  const copia = new Date(fecha);
  copia.setHours(23, 59, 59, 999);
  return copia;
}

function filtrarVentasPorFecha(ventas, fechaInicio, fechaFin) {
  if (!fechaInicio && !fechaFin) return ventas;

  const inicio = fechaInicio ? inicioDelDia(new Date(fechaInicio)) : null;
  const fin = fechaFin ? finDelDia(new Date(fechaFin)) : null;

  return ventas.filter((venta) => {
    const fecha = getFechaVenta(venta);
    return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
  });
}

function crearResumen(ventas) {
  return {
    cantidadPedidos: ventas.length,
    totalVentas: ventas.reduce((acc, venta) => acc + calcularTotal(venta), 0),
  };
}

function getResumenVentas() {
  const ventas = getVentas();
  const ahora = new Date();

  const inicioSemana = inicioDelDia(new Date(ahora));
  inicioSemana.setDate(inicioSemana.getDate() - 6);

  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  return {
    dia: crearResumen(filtrarVentasPorFecha(ventas, inicioDelDia(ahora), finDelDia(ahora))),
    semana: crearResumen(filtrarVentasPorFecha(ventas, inicioSemana, finDelDia(ahora))),
    mes: crearResumen(filtrarVentasPorFecha(ventas, inicioMes, finDelDia(ahora))),
    total: crearResumen(ventas),
  };
}

function getVentasFiltradas(filtros = {}) {
  return filtrarVentasPorFecha(getVentas(), filtros.fechaInicio, filtros.fechaFin);
}

function getProductosMasVendidos(filtros = {}) {
  const productos = new Map();

  getVentasFiltradas(filtros).forEach((venta) => {
    venta.items.forEach((item) => {
      const actual = productos.get(item.nombre) || {
        nombre: item.nombre,
        cantidad: 0,
        total: 0,
      };

      productos.set(item.nombre, {
        ...actual,
        cantidad: actual.cantidad + item.cantidad,
        total: actual.total + item.cantidad * item.precio,
      });
    });
  });

  return Array.from(productos.values()).sort((a, b) => b.cantidad - a.cantidad);
}

function getVentasPorMetodoPago(filtros = {}) {
  const metodos = new Map();

  getVentasFiltradas(filtros).forEach((venta) => {
    const metodo = venta.pago?.metodo || "Sin metodo";
    const actual = metodos.get(metodo) || {
      nombre: metodo,
      cantidad: 0,
      total: 0,
    };

    metodos.set(metodo, {
      ...actual,
      cantidad: actual.cantidad + 1,
      total: actual.total + calcularTotal(venta),
    });
  });

  return Array.from(metodos.values()).sort((a, b) => b.total - a.total);
}

function getVentasPorDia(filtros = {}) {
  const dias = new Map();

  getVentasFiltradas(filtros).forEach((venta) => {
    const fecha = getFechaVenta(venta).toISOString().slice(0, 10);
    const actual = dias.get(fecha) || {
      fecha,
      cantidad: 0,
      total: 0,
    };

    dias.set(fecha, {
      ...actual,
      cantidad: actual.cantidad + 1,
      total: actual.total + calcularTotal(venta),
    });
  });

  return Array.from(dias.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export default {
  getPedidos,
  getPedidosPendientes,
  getPedidoPorId,
  calcularTotal,
  marcarComoPagado,
  getVentas,
  getResumenVentas,
  getVentasFiltradas,
  getProductosMasVendidos,
  getVentasPorMetodoPago,
  getVentasPorDia,
};