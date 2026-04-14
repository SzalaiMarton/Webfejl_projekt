import express from 'express';
import { requireSessionAuth } from '../middleware/authMiddlerware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

import sessionRoutes from './sessionRoutes.js';

const router = express.Router();

router.use('/session', sessionRoutes);

router.post('/login', asyncHandler( async (req, res) => {
    const {username, password} = req.body;
    const id = (Math.random()*300).toString();

    if (!username || !password) {
        res.status(500).json({error: "No username or password were provided."});
    }

    try {
        const user = req.body;
        const now = Date.now();

        req.session.userId = id;
        req.session.createAt = req.session.createdAt || now;
        req.session.lastInteracted = now;
        req.session.expiresAt = new Date(now + (req.session.cookie?.maxAge || 30 * 60 * 1000)).toISOString();

        console.log("session:", req.session);
        res.json({message: "Login successful."});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));

export default router;