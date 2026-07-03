import { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample orders for demo
    const sampleOrders = [
      {
        id: 1,
        user: 'John Doe',
        email: 'john@example.com',
        total: 7999,
        status: 'Pending',
        date: '2024-01-15',
        items: ['Argentina Jersey', 'Brazil Jersey']
      },
      {
        id: 2,
        user: 'Jane Smith',
        email: 'jane@example.com',
        total: 3799,
        status: 'Shipped',
        date: '2024-01-14',
        items: ['France Jersey']
      },
      {
        id: 3,
        user: 'Mike Johnson',
        email: 'mike@example.com',
        total: 11997,
        status: 'Delivered',
        date: '2024-01-13',
        items: ['Portugal Jersey', 'Germany Jersey', 'Spain Jersey']
      }
    ];
    setOrders(sampleOrders);
    setLoading(false);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
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

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user}</td>
                <td>{order.email}</td>
                <td>{order.items.join(', ')}</td>
                <td>Rs. {order.total.toLocaleString()}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;