const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const teamRoutes = require('./routes/teams');
const khaltiRoutes = require('./routes/khalti');
const userRoutes = require('./routes/userRoutes');


// Initialize app
const app = express();
const PORT = process.env.PORT || 5002;

// CORS
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test database connection
testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/khalti', khaltiRoutes);
app.use('/api/users', userRoutes);  

// Home route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Jersey Hub API',
        version: '1.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            orders: '/api/orders',
            cart: '/api/cart',
            teams: '/api/teams',
            khalti: '/api/khalti'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API endpoints:`);
    console.log(`   - POST   /api/auth/register`);
    console.log(`   - POST   /api/auth/login`);
    console.log(`   - POST   /api/auth/admin-login`);
    console.log(`   - GET    /api/products`);
    console.log(`   - GET    /api/products/:id`);
    console.log(`   - POST   /api/products      (Admin only)`);
    console.log(`   - PUT    /api/products/:id  (Admin only)`);
    console.log(`   - DELETE /api/products/:id  (Admin only)`);
    console.log(`   - POST   /api/orders`);
    console.log(`   - GET    /api/orders/my-orders`);
    console.log(`   - GET    /api/cart          (User cart)`);
    console.log(`   - POST   /api/cart          (Add to cart)`);
    console.log(`   - PUT    /api/cart/:id      (Update cart)`);
    console.log(`   - DELETE /api/cart/:id      (Remove from cart)`);
    console.log(`   - GET    /api/teams         (All teams)`);
    console.log(`   - POST   /api/khalti/verify (Verify payment)`);  // ← ADD THIS
});