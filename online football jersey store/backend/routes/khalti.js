const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const OrderModel = require('../models/OrderModel');

// Initiate Khalti payment
router.post('/initiate', verifyToken, async (req, res) => {
    try {
        const { amount, orderId, productName, customerInfo } = req.body;

        // Build the exact payload the ePayment API expects
        const payload = {
            amount: Math.round(amount * 100), // Khalti wants paisa, e.g. Rs 100 = 10000
            return_url: `${process.env.BACKEND_URL}/api/khalti/verify-callback`,
            website_url: process.env.FRONTEND_URL,
            purchase_order_id: orderId,          // was `order_id` — wrong field name for this endpoint
            purchase_order_name: productName || 'Jersey Hub Order',
            customer_info: {
                name: customerInfo?.name || req.user?.name || 'Customer',
                email: customerInfo?.email || req.user?.email,
                phone: customerInfo?.phone || req.user?.phone,
            },
        };

        // 👇 ADD THE CONSOLE.LOG HERE — right before the axios call, after the payload is built
        console.log('Khalti initiate payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(
            `${process.env.KHALTI_API_URL}initiate/`, // e.g. https://khalti.com/api/v2/epayment/
            payload,
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, // secret key goes in header, not public_key in body
                    'Content-Type': 'application/json',
                },
            },
        );

        // 👇 ALSO USEFUL — log what Khalti actually sent back
        console.log('Khalti initiate response:', response.data);

        res.json({
            success: true,
            payment_url: response.data.payment_url,
            pidx: response.data.pidx,
        });
    } catch (error) {
        // 👇 THIS is the most important one — logs Khalti's actual rejection reason
        console.error('Initiate payment error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
        });
    }
});

module.exports = router;