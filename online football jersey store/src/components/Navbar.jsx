import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const logo = '/assets/logo.png';

function Navbar({ searchTerm, setSearchTerm, setShowLogin, isLoggedIn, currentUser, handleLogout }) {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Jersey Hub Logo" 
            className="nav-logo-img"
          />
          <span className="nav-brand-text">JERSEY HUB</span>
        </Link>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="🔍 Search jerseys, players, teams..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
        )}
      </div>
      
      <div className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/shop">SHOP</Link>
        <Link to="/collection">COLLECTION</Link>
        <Link to="/cart">
          CART 🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        {isLoggedIn && currentUser?.role === 'admin' && (
          <Link to="/admin/dashboard" className="admin-link">👑 ADMIN</Link>
        )}
        
        {isLoggedIn ? (
          <div className="user-menu">
            <span className="user-name">👋 {currentUser?.fullName?.split(' ')[0]}</span>
            <button onClick={handleLogout} className="logout-btn">LOGOUT</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} className="login-nav-btn">LOGIN</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;