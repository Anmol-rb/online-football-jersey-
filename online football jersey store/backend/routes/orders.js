const express = require('express');
const router = express.Router();
const OrderModel = require('../models/OrderModel');
const { verifyToken } = require('../middleware/auth');

// Create order
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, total } = req.body;
        const orderId = await OrderModel.create(req.user.id, items, total);
        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully', 
            orderId 
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user orders
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const orders = await OrderModel.getByUser(req.user.id);
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;