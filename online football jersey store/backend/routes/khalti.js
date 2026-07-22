const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const OrderModel = require('../models/OrderModel');

// Initiate Khalti payment
router.post('/initiate', verifyToken, async (req, res) => {
    try {
        const { amount, orderId, productName } = req.body;

        const response = await axios.post(
            'https://khalti.com/api/v2/epayment/initiate/',
            {
                amount: amount,
                order_id: orderId,
                product_identity: 'jerseyhub_order',
                product_name: productName || 'Jersey Hub Order',
                product_url: 'http://localhost:5174/',
                public_key: process.env.KHALTI_PUBLIC_KEY
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            res.json({
                success: true,
                payment_url: response.data.payment_url,
                data: response.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment initiation failed'
            });
        }
    } catch (error) {
        console.error('Initiate payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Verify Khalti payment
router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { token, amount, orderId } = req.body;

        const response = await axios.post(
            'https://khalti.com/api/v2/payment/verify/',
            { token, amount },
            {
                headers: {
                    'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`
                }
            }
        );

        if (response.data.success) {
            await OrderModel.updatePaymentStatus(orderId, 'Paid');
            res.json({ success: true, data: response.data });
        } else {
            res.json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;