import { useEffect, useState } from 'react'
import api from '../api/client'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (err) {
      setError('Could not load products. Is the backend running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) {
      loadProducts()
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/products/search', { params: { keyword: search } })
      setProducts(data)
    } catch (err) {
      setError('Search failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <span className="eyebrow">Live inventory</span>
        <h1>Stock you can actually see.</h1>
        <p className="hero-sub">
          Every listing here reflects real quantity on hand — no guessing whether it's really in stock.
        </p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="state-message">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="state-message">
          No products yet. Add some from your backend's <code>/api/admin/products</code> endpoint.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
