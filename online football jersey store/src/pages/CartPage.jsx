import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createOrder } from '../services/api';
import { initiatePayment } from '../services/khalti';

function CartPage({ isLoggedIn, currentUser, handleLogout, setShowLogin }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, loadCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment result banner state
  const [paymentResult, setPaymentResult] = useState(null);
  const [resultOrderId, setResultOrderId] = useState(null);

  // Handle redirect back from Khalti
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('orderId');

    if (paymentStatus === 'success') {
      setPaymentResult('success');
      setResultOrderId(orderId);
      clearCart();
    } else if (paymentStatus === 'failed') {
      setPaymentResult('failed');
      setResultOrderId(orderId);
      loadCart();
    } else if (paymentStatus === 'error') {
      setPaymentResult('error');
      loadCart();
    }

    if (paymentStatus) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const dismissPaymentResult = () => {
    setPaymentResult(null);
    setResultOrderId(null);
  };

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
    setShowConfirm(false);
    setIsProcessing(true);

    const subtotal = getCartTotal();
    const shipping = subtotal > 1500 ? 0 : 150;
    const grandTotal = subtotal + shipping;

    // ============ FIX: Include image in order items ============
    const orderItems = cartItems.map(item => ({
      id: item.product_id || item.id,
      name: item.name,
      price: item.price,
      size: item.size,
      quantity: item.quantity || 1,
      image: item.image || '/assets/placeholder.jpg'  // ← ADDED IMAGE
    }));

    try {
      // Step 1: Create order first
      const orderResponse = await createOrder({
        items: orderItems,
        total: grandTotal,
        paymentStatus: 'Pending'
      });

      if (!orderResponse.data.success) {
        alert('❌ Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      const realOrderId = orderResponse.data.orderId;
      console.log('🟢 Order created with ID:', realOrderId);

      // Step 2: Initiate Khalti with the REAL order id
      await initiatePayment(1, realOrderId, currentUser, cartItems);

    } catch (error) {
      console.error('❌ Order error:', error);
      alert('❌ Payment failed or cancelled. Please try again.');
      setIsProcessing(false);
    }
  };

  const cancelOrder = () => {
    setShowConfirm(false);
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
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

      {/* ========== PAYMENT RESULT BANNER ========== */}
      {paymentResult && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            {paymentResult === 'success' && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <h2>Payment Successful!</h2>
                <p style={{ margin: '12px 0', color: '#555' }}>
                  Your order has been placed{resultOrderId ? ` — Order ID: ${resultOrderId}` : ''}.
                </p>
                <p style={{ color: '#777', fontSize: '14px' }}>
                  You'll receive a confirmation once your order is processed.
                </p>
              </>
            )}

            {paymentResult === 'failed' && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>❌</div>
                <h2>Payment Failed</h2>
                <p style={{ margin: '12px 0', color: '#555' }}>
                  Your payment could not be completed{resultOrderId ? ` for order ${resultOrderId}` : ''}.
                </p>
                <p style={{ color: '#777', fontSize: '14px' }}>
                  Your items are still in your cart — you can try again.
                </p>
              </>
            )}

            {paymentResult === 'error' && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                <h2>Something Went Wrong</h2>
                <p style={{ margin: '12px 0', color: '#555' }}>
                  We couldn't verify your payment status.
                </p>
                <p style={{ color: '#777', fontSize: '14px' }}>
                  If you were charged, please contact support with your order details.
                </p>
              </>
            )}

            <button
              onClick={dismissPaymentResult}
              style={{
                marginTop: '20px',
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                background: paymentResult === 'success' ? '#0d9488' : '#5C2D91',
                color: '#fff',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      )}

      {/* Cart Page */}
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
            {/* Cart Items */}
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
            
            {/* Order Summary */}
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
              <p>You will be redirected to Khalti for payment.</p>
              <div className="order-details">
                <p><strong>Total Items:</strong> {cartItems.length}</p>
                <p><strong>Subtotal:</strong> Rs. {getCartTotal().toLocaleString('en-IN')}</p>
                <p><strong>Shipping:</strong> {getCartTotal() > 1500 ? 'FREE' : 'Rs. 150'}</p>
                <p><strong>Total Amount:</strong> Rs. {(getCartTotal() + (getCartTotal() > 1500 ? 0 : 150)).toLocaleString('en-IN')}</p>
              </div>
              <p className="payment-note">🔒 You will pay securely via Khalti</p>
            </div>
            <div className="modal-actions" style={{ display: 'flex', gap: '12px' }}>
              <button
                className="modal-cancel-btn"
                onClick={cancelOrder}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  background: '#f5f5f5',
                  color: '#333',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                className="modal-confirm-btn"
                onClick={confirmOrder}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#5C2D91',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <img
                  src="/assets/khalti-logo.png"
                  alt=""
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {isProcessing ? 'Processing...' : 'Pay with Khalti →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;