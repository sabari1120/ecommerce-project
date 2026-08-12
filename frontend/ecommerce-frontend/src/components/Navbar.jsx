import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Stockfront
      </Link>

      <nav className="navbar-links">
        <Link to="/">Shop</Link>
        {user && (
          <Link to="/orders">Orders</Link>
        )}
        <Link to="/cart" className="navbar-cart">
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user ? (
          <div className="navbar-user">
            <span className="navbar-username">{user.fullName}</span>
            <button className="btn-ghost" onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary btn-sm">Log in</Link>
        )}
      </nav>
    </header>
  )
}
