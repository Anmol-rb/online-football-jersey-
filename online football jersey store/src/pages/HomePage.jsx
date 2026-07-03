import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';
import Features from '../components/Features';
import Footer from '../components/Footer';

function HomePage({ 
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

      <Hero />

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading jerseys from the pitch...</p>
        </div>
      )}

      {apiError && !loading && (
        <div className="api-error">
          ⚠️ Could not connect to server. Showing sample data.
        </div>
      )}

      {searchTerm && !loading && (
        <div className="search-results-info">
          🔍 Found {filteredProducts.length} result(s) for "{searchTerm}"
          <button className="clear-search" onClick={() => setSearchTerm('')}>Clear</button>
        </div>
      )}

      {!loading && (
        <ProductList products={filteredProducts} searchTerm={searchTerm} />
      )}

      <Features />
      
      {/* Newsletter component REMOVED */}

      <Footer />
    </div>
  );
}

export default HomePage;