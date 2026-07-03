const express = require('express');
const router = express.Router();
const TeamModel = require('../models/TeamModel');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all teams (Public)
router.get('/', async (req, res) => {
    try {
        const teams = await TeamModel.getAll();
        res.json({ success: true, teams });
    } catch (error) {
        console.error('Get teams error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single team (Public)
router.get('/:id', async (req, res) => {
    try {
        const team = await TeamModel.getById(req.params.id);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.json({ success: true, team });
    } catch (error) {
        console.error('Get team error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============ ADMIN ROUTES ============

// Create team (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, country_code, flag } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Team name is required' });
        }
        const teamId = await TeamModel.create({ name, country_code, flag });
        res.status(201).json({ success: true, message: 'Team created', teamId });
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update team (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, country_code, flag } = req.body;
        const updated = await TeamModel.update(req.params.id, { name, country_code, flag });
        if (updated) {
            res.json({ success: true, message: 'Team updated' });
        } else {
            res.status(404).json({ success: false, message: 'Team not found' });
        }
    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete team (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await TeamModel.delete(req.params.id);
        if (deleted) {
            res.json({ success: true, message: 'Team deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Team not found' });
        }
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;