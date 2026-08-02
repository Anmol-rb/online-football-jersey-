import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const previousOrders = orders;
    // Optimistic update
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setUpdatingId(orderId);

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (!response.data.success) {
        setOrders(previousOrders); // revert on failure
        alert('Failed to update order status.');
      }
    } catch (err) {
      console.error('Update status error:', err);
      setOrders(previousOrders); // revert on error
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>📋 Manage Orders</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>No orders found</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.fullName}</td>
                  <td>{order.email}</td>
                  <td>{order.items.map(item => item.name).join(', ')}</td>
                  <td>Rs. {Number(order.total).toLocaleString()}</td>
                  <td>
                    <span className={`payment-badge ${order.payment_status.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;