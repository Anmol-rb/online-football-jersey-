import { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample users for demo
    const sampleUsers = [
      { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'user', created_at: '2024-01-01' },
      { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: '2024-01-02' },
      { id: 3, fullName: 'Admin User', email: 'admin@example.com', role: 'admin', created_at: '2024-01-01' }
    ];
    setUsers(sampleUsers);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>👤 Manage Users</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;