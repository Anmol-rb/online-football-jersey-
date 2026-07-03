import ProductCard from './ProductCard';

function ProductList({ products, searchTerm }) {
  return (
    <div className="products-section">
      <div className="section-header">
        <h2>{searchTerm ? 'SEARCH RESULTS' : 'FEATURED JERSEYS'}</h2>
        <div className="section-line"></div>
        <p>{searchTerm ? 'Products matching your search' : 'Shop the latest authentic football jerseys'}</p>
      </div>
      
      {products.length === 0 ? (
        <div className="no-results">
          <p>😞 No jerseys found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;