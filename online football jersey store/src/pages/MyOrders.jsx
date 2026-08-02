import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyOrders({ isLoggedIn, currentUser, handleLogout, setShowLogin }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { color: '#ff9800', label: '⏳ Pending' },
      'Processing': { color: '#2196f3', label: '🔄 Processing' },
      'Shipped': { color: '#9c27b0', label: '📦 Shipped' },
      'Delivered': { color: '#4caf50', label: '✅ Delivered' },
      'Cancelled': { color: '#f44336', label: '❌ Cancelled' }
    };
    return statusMap[status] || { color: '#888', label: status };
  };

  const getPaymentStatus = (status) => {
    if (status === 'Paid') {
      return { color: '#4caf50', label: '✅ Paid' };
    } else if (status === 'Pending') {
      return { color: '#ff9800', label: '⏳ Pending' };
    }
    return { color: '#888', label: status };
  };

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="container">
        <Navbar
          searchTerm=""
          setSearchTerm={() => {}}
          setShowLogin={setShowLogin}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
        <div className="empty-cart" style={{ marginTop: '60px' }}>
          <p>🔒 Please login to view your orders</p>
          <button onClick={() => setShowLogin(true)} className="continue-shopping">
            Login Now
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar
        searchTerm=""
        setSearchTerm={() => {}}
        setShowLogin={setShowLogin}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      <div className="my-orders-page">
        <h1>📋 My Orders</h1>
        <div className="page-line"></div>

        {/* ========== REFRESH BUTTON ========== */}
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button
            onClick={fetchOrders}
            style={{
              background: 'transparent',
              border: '1px solid #ffd700',
              color: '#ffd700',
              padding: '8px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ffd700';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#ffd700';
            }}
          >
            🔄 Refresh Status
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="api-error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <p>🛍️ You haven't placed any orders yet</p>
            <Link to="/" className="continue-shopping">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const items = typeof order.items === 'string' 
                ? JSON.parse(order.items) 
                : order.items;
              const statusInfo = getStatusBadge(order.status);
              const paymentInfo = getPaymentStatus(order.payment_status);

              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Order #{order.id}</span>
                      <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <div className="order-badges">
                      <span className="status-badge" style={{ background: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                      <span className="payment-badge" style={{ background: paymentInfo.color }}>
                        {paymentInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="order-item-image">
                          <img 
                            src={item.image || '/assets/placeholder.jpg'} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/60x60/1a1a2e/ffd700?text=⚽';
                            }}
                          />
                        </div>
                        <div className="order-item-details">
                          <h4>{item.name}</h4>
                          <p>Size: {item.size} | Qty: {item.quantity}</p>
                          <p className="order-item-price">Rs. {item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="order-total-amount">Rs. {order.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyOrders;