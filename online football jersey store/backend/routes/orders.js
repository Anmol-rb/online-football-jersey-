const express = require('express');
const router = express.Router();
const OrderModel = require('../models/OrderModel');
const { verifyToken } = require('../middleware/auth');

// Create order
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, total, paymentStatus } = req.body;
        const orderId = await OrderModel.create(req.user.id, items, total, paymentStatus || 'Pending');
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

// Get all orders (Admin)
router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await OrderModel.getAll();
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update order status (Admin)
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const updated = await OrderModel.updateStatus(req.params.id, status);
        if (updated) {
            res.json({ success: true, message: `Order status updated to ${status}` });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;