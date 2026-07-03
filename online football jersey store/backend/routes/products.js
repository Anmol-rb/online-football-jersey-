const express = require('express');
const router = express.Router();
const ProductModel = require('../models/ProductModel');
const { verifyToken, isAdmin } = require('../middleware/auth');

// ============ PUBLIC ROUTES ============

// Get all products (with search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let products;
        if (search) {
            products = await ProductModel.search(search);
        } else {
            products = await ProductModel.getAll();
        }
        res.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ ADMIN ROUTES ============

// Create product (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price, team, player, sizes, image, badge, stock } = req.body;

        // Validation
        if (!name || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and price are required' 
            });
        }

        const productData = {
            name,
            price: parseFloat(price),
            team: team || '',
            player: player || '',
            sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            image: image || '',
            badge: badge || 'NEW',
            stock: stock || 10
        };

        const productId = await ProductModel.create(productData);
        
        res.status(201).json({ 
            success: true, 
            message: 'Product created successfully',
            productId 
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update product (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price, team, player, sizes, image, badge, stock } = req.body;
        
        const productData = {
            name,
            price: parseFloat(price),
            team: team || '',
            player: player || '',
            sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            image: image || '',
            badge: badge || 'NEW',
            stock: stock || 10
        };

        const updated = await ProductModel.update(req.params.id, productData);
        
        if (updated) {
            res.json({ 
                success: true, 
                message: 'Product updated successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete product (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await ProductModel.delete(req.params.id);
        if (deleted) {
            res.json({ 
                success: true, 
                message: 'Product deleted successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;