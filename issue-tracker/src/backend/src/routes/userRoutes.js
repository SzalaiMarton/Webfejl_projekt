import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../services/DatabaseService.js';

const router = express.Router();

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

export default router;