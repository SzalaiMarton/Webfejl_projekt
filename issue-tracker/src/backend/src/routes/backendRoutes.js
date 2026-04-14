import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/health', asyncHandler( async (req, res) => {
    res.json({ 
        status: 'Backend is running', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
}));

export default router;