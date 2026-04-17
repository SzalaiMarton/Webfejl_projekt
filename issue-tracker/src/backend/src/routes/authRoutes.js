import express from 'express';
import UserService from '../services/UserService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireSessionAuth } from '../middleware/authMiddleware.js';
import sessionRoutes from './sessionRoutes.js';
import 'dotenv/config';

const router = express.Router();
const sessionAge = Number(process.env.SESSION_AGE_NORMAL) || 30 * 60 * 1000;

router.use('/session', sessionRoutes);

router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: 'Username, email, and password are required'
        });
    }

    try {
        const user = await UserService.registerUser(username, email, password);

        res.status(201).json({
            message: 'User registered successfully',
            user: user.toJSON()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    try {
        const user = UserService.loginUser(email, password);
        const now = Date.now();

        req.session.userId = user.id;
        req.session.createdAt = req.session.createdAt || now;
        req.session.lastActivity = now;
        req.session.expiresAt = new Date(now + sessionAge).toISOString();

        res.json({
            message: 'Login successful',
            user,
            expiresAt: new Date(now + sessionAge).getTime()
        });
        req.session.save();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}));

router.post('/logout', asyncHandler(async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to destroy session' });
        }

        res.session.user = null;
        res.clearCookie(process.env.SESSION_NAME || 'sid', { path: '/' });
        res.json({ message: 'Logged out' });
    });
}));

router.get('/me', requireSessionAuth, asyncHandler(async (req, res) => {
    try {
        const user = UserService.getUserById(req.userId);
        res.json({ user });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}));

router.get('/currentid', asyncHandler(async (req, res) => {
    try {
        res.json({ id: req.userId });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}));

export default router;
