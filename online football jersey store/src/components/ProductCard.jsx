import { useState } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    // Check if size is selected
    if (!selectedSize) {
      setMessage('⚠️ Please select a size!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    // Pass the full product object including image
    const result = await addToCart(product, selectedSize, 1);
    setMessage(result.success ? `✅ ${result.message}` : `⚠️ ${result.message}`);
    setTimeout(() => setMessage(''), 3000);
    setLoading(false);
  };

  return (
    <div className="product-card">
      <div className="product-badge">{product.badge}</div>
      <div 
        className="product-image" 
        style={{ 
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="player-name">⭐ {product.player}</p>
        <p className="team">{product.team}</p>
        
        <div className="size-selector">
          <label>Select Size:</label>
          <div className="size-buttons">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="price-row">
          <p className="price">Rs. {product.price.toLocaleString('en-IN')}</p>
          <span className="original-price">Rs. {(product.price + 1000).toLocaleString('en-IN')}</span>
        </div>
        {message && <div className="product-message">{message}</div>}
        <button 
          className="btn-add" 
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'ADD TO CART →'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;