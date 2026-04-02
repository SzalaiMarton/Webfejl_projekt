import express from 'express';
import UserService from '../services/UserService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Felhasználó regisztrálása
 */
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

/**
 * POST /api/auth/login
 * Bejelentkezés
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    const user = UserService.loginUser(email, password);

    res.json({
      message: 'Login successful',
      user,
      token: user.id // Egyszerű token (valós app-ban JWT)
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}));

/**
 * GET /api/auth/me
 * Aktuális felhasználó adatai
 */
router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  try {
    const user = UserService.getUserById(req.userId);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

export default router;
