const STORAGE_KEY = "lys_pedidos"; // misma key que usa Caja

export const ESTADOS_COCINA = {
  NUEVO: "nuevo",
  EN_PREPARACION: "en_preparacion",
  LISTO: "listo",
  ENTREGADO: "entregado",
};

const seedPedidos = [];

function inicializar() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPedidos));
    return;
  }

  // Compatibilidad: pedidos viejos sin estadoCocina, o creados por otro módulo
  const pedidos = JSON.parse(data);
  let necesitaMigrar = false;
  const migrados = pedidos.map((p) => {
    let cambios = {};
    if (!p.estadoCocina) {
      necesitaMigrar = true;
      cambios.estadoCocina = ESTADOS_COCINA.NUEVO;
    }
    if (!p.estado) {
      necesitaMigrar = true;
      cambios.estado = "pendiente";
    }
    return Object.keys(cambios).length ? { ...p, ...cambios } : p;
  });
  if (necesitaMigrar) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrados));
  }
}

function getPedidos() {
  inicializar();
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function getPedidosPorEstado(estado) {
  return getPedidos()
    .filter((p) => p.estadoCocina === estado)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function getPedidosActivos() {
  return getPedidos().filter((p) => p.estadoCocina !== ESTADOS_COCINA.ENTREGADO);
}

function getPedidosFinalizados() {
  return getPedidos()
    .filter((p) => p.estadoCocina === ESTADOS_COCINA.ENTREGADO)
    .sort((a, b) => new Date(b.finalizadoAt || b.createdAt) - new Date(a.finalizadoAt || a.createdAt));
}

function cambiarEstado(id, nuevoEstado) {
  const pedidos = getPedidos();
  const actualizados = pedidos.map((p) => {
    if (p.id !== id) return p;
    const cambios = { ...p, estadoCocina: nuevoEstado };
    if (nuevoEstado === ESTADOS_COCINA.ENTREGADO) {
      cambios.finalizadoAt = new Date().toISOString();
    }
    return cambios;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  return actualizados.find((p) => p.id === id);
}

// Crea un pedido nuevo desde cualquier módulo (Mesas, Checkout web, etc.)
// "id" es opcional: si el módulo que llama ya generó un número de pedido
// (ej. el checkout del cliente con "LS-XXXX"), se reutiliza para no duplicar.
function crearPedido({ id, mesa = null, cliente, items, observaciones = "", tipo = "salon", total } = {}) {
  const pedidos = getPedidos();
  const nuevoId = id || `PED-${1000 + pedidos.length + 1}`;
  const nuevoPedido = {
    id: nuevoId,
    mesa,
    cliente: cliente || (mesa ? `Mesa ${mesa}` : "Cliente"),
    tipo,
    estadoCocina: ESTADOS_COCINA.NUEVO,
    estado: "pendiente",
    observaciones,
    items,
    ...(total !== undefined ? { total } : {}),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...pedidos, nuevoPedido]));
  return nuevoPedido;
}

export default {
  getPedidos,
  getPedidosPorEstado,
  getPedidosActivos,
  getPedidosFinalizados,
  cambiarEstado,
  crearPedido,
};