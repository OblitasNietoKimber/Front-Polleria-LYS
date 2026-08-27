const STORAGE_KEY = "lys_pedidos";

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

export default {
  getPedidos,
  getPedidosPendientes,
  getPedidoPorId,
  calcularTotal,
  marcarComoPagado,
};