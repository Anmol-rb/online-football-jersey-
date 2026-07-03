const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ============ GET USER'S CART ============
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = `
            SELECT c.id, c.product_id, c.size, c.quantity, 
                   p.name, p.price, p.team, p.player, p.image, p.badge
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        const [rows] = await db.query(sql, [userId]);
        res.json({ success: true, cart: rows });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ ADD ITEM TO CART ============
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size, quantity } = req.body;

        // Check if item already exists in cart
        const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?';
        const [existing] = await db.query(checkSql, [userId, productId, size]);

        if (existing.length > 0) {
            // Update quantity
            const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE id = ?';
            await db.query(updateSql, [quantity || 1, existing[0].id]);
        } else {
            // Insert new item
            const insertSql = 'INSERT INTO cart (user_id, product_id, size, quantity) VALUES (?, ?, ?, ?)';
            await db.query(insertSql, [userId, productId, size, quantity || 1]);
        }

        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ UPDATE CART ITEM QUANTITY ============
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;
        const { quantity } = req.body;

        const sql = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';
        const [result] = await db.query(sql, [quantity, cartId, userId]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Cart updated' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ REMOVE ITEM FROM CART ============
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;

        const sql = 'DELETE FROM cart WHERE id = ? AND user_id = ?';
        const [result] = await db.query(sql, [cartId, userId]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Item removed from cart' });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ CLEAR CART ============
router.delete('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = 'DELETE FROM cart WHERE user_id = ?';
        await db.query(sql, [userId]);
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;