const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { verifyToken } = require('../middleware/auth');

// ============ REGISTER ============
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, dob, gender, phone, address, city, country } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userId = await UserModel.create({
            fullName,
            email,
            password: hashedPassword,
            dob,
            gender,
            phone,
            address,
            city,
            country: country || 'Nepal'
        });

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully', 
            userId 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ USER LOGIN ============
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const userData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
            city: user.city,
            country: user.country
        };

        res.json({ 
            success: true, 
            message: 'Login successful', 
            token, 
            user: userData 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ ADMIN LOGIN ============
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const userData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
            city: user.city,
            country: user.country
        };

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ GET CURRENT USER ============
router.get('/me', verifyToken, async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;