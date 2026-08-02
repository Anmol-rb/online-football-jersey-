const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all users — admin only
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;