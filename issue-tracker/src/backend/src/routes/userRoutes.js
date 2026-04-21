import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../services/DatabaseService.js';
import { requireSessionAuth } from '../middleware/authMiddleware.js';
import UserService from '../services/UserService.js';

const router = express.Router();

router.get('/', requireSessionAuth, asyncHandler(async (req, res) => {
    try {
        const users = UserService.getAllUsers();
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

router.get('/get/:userId', asyncHandler( async (req, res) => {
    const { userId } = req.params;
    try {
        const user = db.getUserById(userId);
        if (user === undefined) {
            res.status(500).json({error: "User not found."});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));

router.get('/:userId/comment-ids', asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = db.getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const commentIds = user.createdComments || [];
        res.json({ commentIds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

router.get('/me/comment-ids', requireSessionAuth, asyncHandler(async (req, res) => {
    try {
        const user = db.getUserById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const commentIds = user.createdComments || [];
        res.json({ commentIds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

export default router;
