import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        // In a real app, you'd fetch from API
        setStats({
          totalOrders: 25,
          totalRevenue: 85000,
          totalProducts: 8,
          totalUsers: 12
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-nav">
        <h1>👑 Admin Dashboard</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>📦 Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Revenue</h3>
          <p className="stat-number">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>👕 Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>👤 Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="admin-quick-actions">
        <a href="/admin/products" className="quick-action-btn">📦 Manage Products</a>
        <a href="/admin/orders" className="quick-action-btn">📋 Manage Orders</a>
        <a href="/admin/users" className="quick-action-btn">👤 Manage Users</a>
        <a href="/admin/teams" className="quick-action-btn">🏆 Manage Teams</a>
      </div>
    </div>
  );
}

export default AdminDashboard;