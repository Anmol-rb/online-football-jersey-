import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ AUTH APIs ============

// Register user
export const register = (userData) => api.post('/auth/register', userData);

// Login user (Regular user)
export const login = (userData) => api.post('/auth/login', userData);

// Admin Login
export const adminLogin = (userData) => api.post('/auth/admin-login', userData);

// Get current user
export const getCurrentUser = () => api.get('/auth/me');

// ============ PRODUCT APIs ============

// Get all products (with optional search)
export const getProducts = (search = '') => {
    return api.get(`/products${search ? `?search=${search}` : ''}`);
};

// Get single product by ID
export const getProduct = (id) => api.get(`/products/${id}`);

// ============ ORDER APIs ============

// Create new order
export const createOrder = (orderData) => api.post('/orders', orderData);

// Get user's orders
export const getMyOrders = () => api.get('/orders/my-orders');

// ============ CART APIs ============

// Get user's cart
export const getCart = () => api.get('/cart');

// Add item to cart
export const addToCart = (productId, size, quantity = 1) => 
    api.post('/cart', { productId, size, quantity });

// Update cart item quantity
export const updateCartItem = (cartId, quantity) => 
    api.put(`/cart/${cartId}`, { quantity });

// Remove item from cart
export const removeCartItem = (cartId) => 
    api.delete(`/cart/${cartId}`);

// Clear cart (after order placed)
export const clearCart = () => api.delete('/cart');
// ============ TEAM APIs ============

// Get all teams
export const getTeams = () => api.get('/teams');

// Create team (Admin only)
export const createTeam = (teamData) => api.post('/teams', teamData);

// Update team (Admin only)
export const updateTeam = (id, teamData) => api.put(`/teams/${id}`, teamData);

// Delete team (Admin only)
export const deleteTeam = (id) => api.delete(`/teams/${id}`);

// ============ KHALTI APIs ============

// Verify Khalti payment
export const verifyPayment = (token, amount, orderId) => 
    api.post('/khalti/verify', { token, amount, orderId });

export default api;