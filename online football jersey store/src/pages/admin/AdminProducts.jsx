import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import api from '../../services/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    team: '',
    player: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'NEW',
    stock: 10,
    image: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        team: formData.team,
        player: formData.player,
        sizes: formData.sizes,
        badge: formData.badge,
        stock: parseInt(formData.stock),
        image: formData.image || ''
      };

      let response;
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        response = await api.post('/products', productData);
      }

      if (response.data.success) {
        setMessage(`✅ ${editingProduct ? 'Updated' : 'Added'} successfully!`);
        setTimeout(() => setMessage(''), 3000);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || 'Something went wrong'}`);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      team: '',
      player: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      badge: 'NEW',
      stock: 10,
      image: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      team: product.team || '',
      player: product.player || '',
      sizes: JSON.parse(product.sizes || '["S","M","L","XL","XXL"]'),
      badge: product.badge || 'NEW',
      stock: product.stock || 10,
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setMessage('✅ Product deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchProducts();
      } catch (error) {
        setMessage('❌ Error deleting product');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>📦 Manage Products</h1>
        <div className="admin-header-actions">
          <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕ Close' : '+ Add New Product'}
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Jersey'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Jersey Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Argentina Messi #10"
                required
              />
            </div>
            <div className="form-group">
              <label>Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 3999"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Team</label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="e.g., Argentina"
              />
            </div>
            <div className="form-group">
              <label>Player Name</label>
              <input
                type="text"
                name="player"
                value={formData.player}
                onChange={handleChange}
                placeholder="e.g., Lionel Messi"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Badge</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
              >
                <option value="NEW">NEW</option>
                <option value="LIMITED">LIMITED</option>
                <option value="BEST SELLER">BEST SELLER</option>
                <option value="ICON">ICON</option>
                <option value="SALE">SALE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Available Sizes</label>
            <div className="size-checkboxes">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <label key={size} className="size-checkbox">
                  <input
                    type="checkbox"
                    checked={(formData.sizes || []).includes(size)}
                    onChange={() => handleSizeToggle(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Team</th>
              <th>Player</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Badge</th>
              <th>Sizes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.team}</td>
                <td>{product.player}</td>
                <td>Rs. {product.price}</td>
                <td>{product.stock}</td>
                <td><span className="badge">{product.badge}</span></td>
                <td>{JSON.parse(product.sizes || '[]').join(', ')}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;