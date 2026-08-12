import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const statusTone = {
  PENDING: 'low',
  CONFIRMED: 'ok',
  SHIPPED: 'ok',
  DELIVERED: 'ok',
  CANCELLED: 'out',
}

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [user])

  async function loadOrders() {
    setLoading(true)
    try {
      const { data } = await api.get('/orders')
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="state-message">Loading orders…</div>

  return (
    <div className="page">
      <span className="eyebrow">Order history</span>
      <h1>Your orders</h1>

      {orders.length === 0 ? (
        <div className="state-message">No orders yet.</div>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">Order #{order.id}</span>
                <span className={`stock-ribbon stock-ribbon--${statusTone[order.status] || 'ok'}`}>
                  {order.status}
                </span>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity} — ₹{Number(item.priceAtPurchase).toFixed(2)} each
                  </li>
                ))}
              </ul>
              <div className="order-card-footer">
                <span>Placed {new Date(order.createdAt).toLocaleString()}</span>
                <span className="order-total">₹{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
