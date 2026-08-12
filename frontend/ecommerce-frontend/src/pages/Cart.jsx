import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { user } = useAuth()
  const { cartItems, loading, fetchCart, removeFromCart, checkout, cartTotal } = useCart()
  const navigate = useNavigate()
  const [placingOrder, setPlacingOrder] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user])

  async function handleCheckout() {
    setError('')
    setPlacingOrder(true)
    try {
      await checkout()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed.')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) return <div className="state-message">Loading cart…</div>

  return (
    <div className="page">
      <span className="eyebrow">Your cart</span>
      <h1>Review before checkout</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {cartItems.length === 0 ? (
        <div className="state-message">
          Your cart is empty. <a href="/">Go find something to add.</a>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-row">
                <div className="cart-row-info">
                  <span className="cart-row-name">{item.product.name}</span>
                  <span className="cart-row-meta">
                    ₹{Number(item.product.price).toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <div className="cart-row-actions">
                  <span className="cart-row-subtotal">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button className="btn-ghost" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <span>Total</span>
            <span className="cart-total-amount">₹{cartTotal.toFixed(2)}</span>
          </div>

          <button className="btn-primary btn-block" onClick={handleCheckout} disabled={placingOrder}>
            {placingOrder ? 'Placing order…' : 'Place order'}
          </button>
        </>
      )}
    </div>
  )
}
