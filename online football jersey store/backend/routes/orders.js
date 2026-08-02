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

const {isAdmin } = require('../middleware/auth');

// GET all orders — admin only
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await OrderModel.findAll();
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update order status — admin only
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const updated = await OrderModel.updateStatus(id, status);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
module.exports = router;