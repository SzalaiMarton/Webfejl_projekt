import express from 'express';
import { requireSessionAuth } from '../middleware/authMiddlerware.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/get', asyncHandler(async (req, res) => {
    try {
        if (!req.session) {
            return res.status(405).json({error: "Session doesn't exist."});
        }
        return res.json({session: req.session});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));

export default router;