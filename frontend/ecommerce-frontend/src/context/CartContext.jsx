import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/client'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCartItems(data)
    } finally {
      setLoading(false)
    }
  }, [])

  async function addToCart(productId, quantity = 1) {
    await api.post('/cart', { productId, quantity })
    await fetchCart()
  }

  async function removeFromCart(cartItemId) {
    await api.delete(`/cart/${cartItemId}`)
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
  }

  async function checkout() {
    const { data } = await api.post('/orders')
    setCartItems([])
    return data
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ cartItems, loading, fetchCart, addToCart, removeFromCart, checkout, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
