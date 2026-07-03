import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CollectionPage from './pages/CollectionPage';
import CartPage from './pages/CartPage';
import LoginRegister from './LoginRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import { getProducts } from './services/api';
import AdminTeams from './pages/admin/AdminTeams';
import './App.css';

// Image URLs from public folder
const messiImg = '/assets/messi.jpg';
const neymarImg = '/assets/neymar.jpg';
const mbappeImg = '/assets/mbappe.jpg';
const ronaldoImg = '/assets/ronaldo.jpg';
const musialaImg = '/assets/musiala.jpg';
const pedriImg = '/assets/pedri.jpg';
const kaneImg = '/assets/kane.jpg';
const vandijkImg = '/assets/vandijk.jpg';

const fallbackProducts = [
    { id: 1, name: 'Argentina Messi #10', price: 3999, team: 'Argentina', player: 'Lionel Messi', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: messiImg, badge: 'LIMITED' },
    { id: 2, name: 'Brazil Neymar #10', price: 3899, team: 'Brazil', player: 'Neymar Jr', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: neymarImg, badge: 'BEST SELLER' },
    { id: 3, name: 'France Mbappé #7', price: 3799, team: 'France', player: 'Kylian Mbappé', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: mbappeImg, badge: 'NEW' },
    { id: 4, name: 'Portugal Ronaldo #7', price: 3699, team: 'Portugal', player: 'Cristiano Ronaldo', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: ronaldoImg, badge: 'ICON' },
    { id: 5, name: 'Germany Home Jersey', price: 4199, team: 'Germany', player: 'Jamal Musiala', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: musialaImg, badge: 'LIMITED' },
    { id: 6, name: 'Spain Home Jersey', price: 3999, team: 'Spain', player: 'Pedri', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: pedriImg, badge: 'NEW' },
    { id: 7, name: 'England Home Jersey', price: 3799, team: 'England', player: 'Harry Kane', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: kaneImg, badge: 'BEST SELLER' },
    { id: 8, name: 'Netherlands Jersey', price: 3599, team: 'Netherlands', player: 'Virgil van Dijk', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: vandijkImg, badge: 'SALE' },
];

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [products, setProducts] = useState(fallbackProducts);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                if (response.data.success) {
                    const formattedProducts = response.data.products.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: parseFloat(p.price),
                        team: p.team,
                        player: p.player,
                        sizes: JSON.parse(p.sizes || '["S","M","L","XL","XXL"]'),
                        image: p.image || fallbackProducts.find(f => f.id === p.id)?.image || messiImg,
                        badge: p.badge || 'NEW'
                    }));
                    setProducts(formattedProducts);
                    setApiError(false);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setApiError(true);
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('currentUser');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const handleAdminLogin = (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setIsLoggedIn(true);
        window.location.href = '/admin/dashboard';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    const AdminRoute = ({ children }) => {
        if (!isLoggedIn || currentUser?.role !== 'admin') {
            return <div className="access-denied">
                <h2>🔒 Access Denied</h2>
                <p>Admin access only.</p>
                <a href="/">Go to Homepage</a>
            </div>;
        }
        return children;
    };

    if (showLogin) {
        return <LoginRegister onLogin={handleLogin} />;
    }

    return (
        <BrowserRouter>
            <CartProvider>
                <Routes>
                    <Route path="/" element={
                        <HomePage
                            products={products}
                            loading={loading}
                            apiError={apiError}
                            isLoggedIn={isLoggedIn}
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                            setShowLogin={setShowLogin}
                        />
                    } />
                    
                    <Route path="/shop" element={
                        <ShopPage
                            products={products}
                            loading={loading}
                            apiError={apiError}
                            isLoggedIn={isLoggedIn}
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                            setShowLogin={setShowLogin}
                        />
                    } />
                    
                    <Route path="/collection" element={
                        <CollectionPage
                            products={products}
                            loading={loading}
                            apiError={apiError}
                            isLoggedIn={isLoggedIn}
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                            setShowLogin={setShowLogin}
                        />
                    } />
                    
                    <Route path="/cart" element={
                        <CartPage
                            isLoggedIn={isLoggedIn}
                            currentUser={currentUser}
                            handleLogout={handleLogout}
                            setShowLogin={setShowLogin}
                        />
                    } />
                    
                    <Route path="/admin-login" element={
                        <AdminLogin onAdminLogin={handleAdminLogin} />
                    } />
                    
                    <Route path="/admin/dashboard" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    
                    <Route path="/admin/products" element={
                        <AdminRoute>
                            <AdminProducts />
                        </AdminRoute>
                    } />
                    
                    <Route path="/admin/orders" element={
                        <AdminRoute>
                            <AdminOrders />
                        </AdminRoute>
                    } />
                    
                    <Route path="/admin/users" element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    } />

                    <Route path="/admin/teams" element={
    <AdminRoute>
        <AdminTeams />
    </AdminRoute>
} />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;