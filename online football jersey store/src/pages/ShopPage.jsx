import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';

function ShopPage({ 
  products,
  loading,
  apiError,
  isLoggedIn,
  currentUser,
  handleLogout,
  setShowLogin
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowLogin={setShowLogin}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      <div className="page-header">
        <h1>🛍️ All Jerseys</h1>
        <p>Browse our complete collection of authentic football jerseys</p>
        <div className="page-line"></div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading jerseys...</p>
        </div>
      )}

      {apiError && !loading && (
        <div className="api-error">
          ⚠️ Could not connect to server. Showing sample data.
        </div>
      )}

      {!loading && (
        <ProductList products={filteredProducts} searchTerm={searchTerm} />
      )}

      <Footer />
    </div>
  );
}

export default ShopPage;