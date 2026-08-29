const STORAGE_KEY = 'lys-client-orders'

export const ORDER_STATUS_STEPS = [
  { key: 'recibido', label: 'Recibido' },
  { key: 'preparacion', label: 'En preparación' },
  { key: 'listo', label: 'Listo' },
  { key: 'camino', label: 'En camino' },
  { key: 'entregado', label: 'Entregado' },
]

// Minutos transcurridos en los que el pedido avanza de etapa (simulación sin backend)
const TIMELINE_DELIVERY = [0, 2, 5, 8, 14]
const TIMELINE_PICKUP = [0, 2, 5, 5, 9] // recojo en tienda no tiene "en camino"

function readOrders() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeOrders(orders) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // localStorage no disponible (modo privado, cuotas, etc.)
  }
}

function getOrders() {
  return readOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function getOrderById(id) {
  return readOrders().find((order) => order.id === id) || null
}

function createOrder({ id, items, subtotal, shipping, total, deliveryType, form, payment }) {
  const order = {
    id,
    items: items.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
    })),
    subtotal,
    shipping,
    total,
    deliveryType,
    form,
    payment,
    createdAt: new Date().toISOString(),
  }

  const orders = readOrders()
  orders.push(order)
  writeOrders(orders)
  return order
}

// Calcula la etapa actual según el tiempo transcurrido desde la creación
function getOrderStatus(order) {
  const timeline = order.deliveryType === 'delivery' ? TIMELINE_DELIVERY : TIMELINE_PICKUP
  const minutesElapsed = (Date.now() - new Date(order.createdAt).getTime()) / 60000

  let stepIndex = 0
  for (let i = 0; i < timeline.length; i++) {
    if (minutesElapsed >= timeline[i]) stepIndex = i
  }
  return ORDER_STATUS_STEPS[stepIndex].key
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  getOrderStatus,
}