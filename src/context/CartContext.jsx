import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'lys-cart'
const DELIVERY_STORAGE_KEY = 'lys-checkout-delivery'
const PAYMENT_STORAGE_KEY = 'lys-checkout-payment'

const EMPTY_FORM = { name: '', address: '', reference: '', phone: '' }

function readStoredCart() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function readStoredDelivery() {
  if (typeof window === 'undefined') return { deliveryType: 'delivery', form: EMPTY_FORM }
  try {
    const raw = window.localStorage.getItem(DELIVERY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { deliveryType: 'delivery', form: EMPTY_FORM }
  } catch {
    return { deliveryType: 'delivery', form: EMPTY_FORM }
  }
}

function readStoredPayment() {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(PAYMENT_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readStoredCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [deliveryType, setDeliveryType] = useState(() => readStoredDelivery().deliveryType)
  const [form, setForm] = useState(() => readStoredDelivery().form)
  const [payment, setPayment] = useState(readStoredPayment)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // localStorage no disponible (modo privado, cuotas, etc.)
    }
  }, [cart])

  useEffect(() => {
    try {
      window.localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify({ deliveryType, form }))
    } catch {
      // localStorage no disponible (modo privado, cuotas, etc.)
    }
  }, [deliveryType, form])

  useEffect(() => {
    try {
      window.localStorage.setItem(PAYMENT_STORAGE_KEY, payment)
    } catch {
      // localStorage no disponible (modo privado, cuotas, etc.)
    }
  }, [payment])

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
        .filter((item) => item.product && item.qty > 0),
    [cart]
  )
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.qty * item.product.price, 0)

  function openCart() {
    setCartOpen(true)
  }

  function closeCart() {
    setCartOpen(false)
  }

  function addToCart(id, qty = 1) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + qty }))
  }

  function removeItem(id) {
    setCart((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  function setQty(id, qty) {
    setCart((current) => {
      const next = { ...current }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  function updateFormField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const value = {
    cartItems,
    cartCount,
    subtotal,
    cartOpen,
    openCart,
    closeCart,
    addToCart,
    removeItem,
    setQty,
    deliveryType,
    setDeliveryType,
    form,
    updateFormField,
    payment,
    setPayment,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
