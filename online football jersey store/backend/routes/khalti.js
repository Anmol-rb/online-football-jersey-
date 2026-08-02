require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const OrderModel = require('../models/OrderModel');

const KHALTI_API_URL = process.env.KHALTI_API_URL; // e.g. https://khalti.com/api/v2/epayment/
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

// ---------------------------------------------------------
// Initiate Khalti payment
// ---------------------------------------------------------
router.post('/initiate', verifyToken, async (req, res) => {
    try {
        const { amount, orderId, productName, customerInfo } = req.body;

        const payload = {
            amount: Math.round(amount * 100),
            return_url: `${BACKEND_URL}/api/khalti/verify-callback`,
            website_url: FRONTEND_URL,
            purchase_order_id: orderId,
            purchase_order_name: productName || 'Jersey Hub Order',
            customer_info: {
                name: customerInfo?.name || req.user?.name || 'Customer',
                email: customerInfo?.email || req.user?.email,
                phone: customerInfo?.phone || req.user?.phone,
            },
        };

        console.log('Khalti initiate payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(
            `${KHALTI_API_URL}initiate/`,
            payload,
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('Khalti initiate response:', response.data);

        res.json({
            success: true,
            payment_url: response.data.payment_url,
            pidx: response.data.pidx,
        });
    } catch (error) {
        console.error('Initiate payment error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
        });
    }
});

// ---------------------------------------------------------
// Callback route — Khalti redirects the browser here after payment.
// THIS WAS MISSING — this is what "Route not found" means.
// ---------------------------------------------------------
router.get('/verify-callback', async (req, res) => {
    try {
        const { pidx, purchase_order_id } = req.query;
        console.log('Callback hit with query:', req.query);

        const lookupResponse = await axios.post(
            `${KHALTI_API_URL}lookup/`,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                },
            },
        );

        const { status, transaction_id } = lookupResponse.data;
        console.log('Lookup result:', lookupResponse.data);

        if (status === 'Completed') {
            await OrderModel.updatePaymentStatus(purchase_order_id, 'Paid', {
                transactionId: transaction_id,
            });
            return res.redirect(`${FRONTEND_URL}/cart?payment=success&orderId=${purchase_order_id}`);
        }

        await OrderModel.updatePaymentStatus(purchase_order_id, 'Failed');
        return res.redirect(`${FRONTEND_URL}/cart?payment=failed&orderId=${purchase_order_id}&status=${status}`);
    } catch (error) {
        console.error('Verify callback error:', error.response?.data || error.message);
        return res.redirect(`${FRONTEND_URL}/cart?payment=error`);
    }
});

// ---------------------------------------------------------
// Optional: manual lookup endpoint
// ---------------------------------------------------------
router.post('/lookup', verifyToken, async (req, res) => {
    try {
        const { pidx } = req.body;

        const response = await axios.post(
            `${KHALTI_API_URL}lookup/`,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                },
            },
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Lookup error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;