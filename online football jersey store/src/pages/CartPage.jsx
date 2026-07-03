import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

function CartPage({ isLoggedIn, currentUser, handleLogout, setShowLogin }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    setIsProcessing(true);
    setShowConfirm(false);

    const orderItems = cartItems.map(item => ({
      id: item.product_id || item.id,
      name: item.name,
      price: item.price,
      size: item.size,
      quantity: item.quantity || 1
    }));

    const total = getCartTotal();

    try {
      const response = await createOrder({
        items: orderItems,
        total: total
      });

      if (response.data.success) {
        alert(`✅ Order placed successfully! Order ID: #${response.data.orderId}`);
        await clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelOrder = () => {
    setShowConfirm(false);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo.png" alt="Jersey Hub Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', marginRight: '5px' }} />
            JERSEY HUB
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">← BACK TO SHOP</Link>
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

      <div className="cart-page">
        <h1>YOUR CART 🛒</h1>
        <div className="cart-line"></div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>🛍️ Your cart is empty</p>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/80x80/1a1a2e/ffd700?text=⚽';
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>⭐ {item.player}</p>
                    <p>Team: {item.team}</p>
                    <p>Size: <span className="cart-size-badge">{item.size}</span></p>
                  </div>
                  <div className="cart-item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.size, (item.quantity || 1) - 1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, (item.quantity || 1) + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <p>Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{getCartTotal() > 1500 ? 'FREE' : 'Rs. 150'}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs. {(getCartTotal() + (getCartTotal() > 1500 ? 0 : 150)).toLocaleString('en-IN')}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'PROCEED TO CHECKOUT →'}
              </button>
              <Link to="/" className="continue-shop-btn">Continue Shopping</Link>
            </div>
          </>
        )}
      </div>

      {/* ========== CONFIRMATION MODAL ========== */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Order</h2>
            <div className="modal-body">
              <p>Are you sure you want to place this order?</p>
              <div className="order-details">
                <p><strong>Total Items:</strong> {cartItems.length}</p>
                <p><strong>Total Amount:</strong> Rs. {(getCartTotal() + (getCartTotal() > 1500 ? 0 : 150)).toLocaleString('en-IN')}</p>
              </div>
              <p className="payment-note">💳 Payment will be collected on delivery.</p>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={cancelOrder}>Cancel</button>
              <button className="modal-confirm-btn" onClick={confirmOrder}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;