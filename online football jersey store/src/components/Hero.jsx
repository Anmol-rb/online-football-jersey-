function Hero() {
  return (
    <div className="hero">
      <div className="hero-badge">EST. 2024</div>
      <h1>JERSEY HUB</h1>
      <p>Elevate Your Game • Authentic Football Jerseys • Limited Edition</p>
      <button className="btn-primary" onClick={() => alert('Shop the collection!')}>
        SHOP NOW →
      </button>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">🏟️</span>
          <span className="stat-label">Stadium Ready</span>
        </div>
        <div className="stat">
          <span className="stat-number">👕</span>
          <span className="stat-label">For the fans</span>
        </div>
        <div className="stat">
          <span className="stat-number">⚽</span>
          <span className="stat-label">Match Day Feel</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;