import express from 'express';
import { requireSessionAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import "dotenv/config";

const router = express.Router();
const sessionAge = Number(process.env.SESSION_AGE_NORMAL) || 30 * 60 * 1000;

router.post('/refresh', requireSessionAuth, asyncHandler( async (req, res) => {
  try {
    if (!req.session) return res.status(400).json({ error: 'No active session' });

    const now = Date.now();
    req.session.lastActivity = now;
    req.session.expiresAt = new Date(now + sessionAge).toISOString();

    if (typeof req.session.touch === 'function') req.session.touch();

    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Failed to save session' });
      res.json({ message: 'Session refreshed' });
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}));

router.get('/get', asyncHandler( async (req, res) => {
  try {
    res.json({session: req.session});
  } catch (error) {
    res.status(404).json({error: error.message});
  }
}));

router.post('/clear', asyncHandler( async (req, res) => {
  try {
    if (!req.session) return res.json({ message: 'No active session' });

    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Failed to destroy session' });
      res.clearCookie(process.env.SESSION_NAME || 'sid', { path: '/' });
      res.json({ message: 'Session has been cleared.' });
    });
  } catch (error) {
    res.status(404).json({error: error.message});
  }
}));

export default router;