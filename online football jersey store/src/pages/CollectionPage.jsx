import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import { getTeams } from '../services/api';

function CollectionPage({ 
  products,
  loading,
  apiError,
  isLoggedIn,
  currentUser,
  handleLogout,
  setShowLogin
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('All');
  const [teams, setTeams] = useState(['All']);
  const [teamsLoading, setTeamsLoading] = useState(true);

  // Fetch teams from database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        if (response.data.success) {
          const teamNames = ['All', ...response.data.teams.map(t => t.name)];
          setTeams(teamNames);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Fallback: get from products
        const teamNames = ['All', ...new Set(products.map(p => p.team).filter(Boolean))];
        setTeams(teamNames);
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchTeams();
  }, [products]);

  // Filter products by team and search
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'All' || product.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

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
        <h1>👕 Collection</h1>
        <p>Explore jerseys by team</p>
        <div className="page-line"></div>
      </div>

      {/* Team Filter */}
      <div className="collection-filters">
        <div className="filter-label">Filter by Team:</div>
        <div className="filter-buttons">
          {teamsLoading ? (
            <span style={{ color: '#888' }}>Loading teams...</span>
          ) : (
            teams.map(team => (
              <button
                key={team}
                className={`filter-btn ${filterTeam === team ? 'active' : ''}`}
                onClick={() => setFilterTeam(team)}
              >
                {team}
              </button>
            ))
          )}
        </div>
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

export default CollectionPage;