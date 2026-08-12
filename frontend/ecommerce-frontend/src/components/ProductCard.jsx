import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function stockStatus(qty) {
  if (qty <= 0) return { label: 'Out of stock', tone: 'out' }
  if (qty <= 5) return { label: `${qty} left`, tone: 'low' }
  return { label: 'In stock', tone: 'ok' }
}

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const status = stockStatus(product.stockQuantity)

  async function handleAdd() {
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await addToCart(product.id, 1)
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="product-card">
      <div className="product-media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-media-placeholder">{product.name.charAt(0)}</div>
        )}
        <span className={`stock-ribbon stock-ribbon--${status.tone}`}>{status.label}</span>
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        {product.category && (
          <span className="product-category">{product.category.name}</span>
        )}
        <p className="product-price">₹{Number(product.price).toFixed(2)}</p>

        <button
          className="btn-primary btn-block"
          onClick={handleAdd}
          disabled={adding || product.stockQuantity <= 0}
        >
          {product.stockQuantity <= 0 ? 'Out of stock' : adding ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
