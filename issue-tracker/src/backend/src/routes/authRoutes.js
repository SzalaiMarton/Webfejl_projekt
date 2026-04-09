import express from 'express';
import session from 'express-session';
import UserService from '../services/UserService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireSessionAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password)
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

    req.session.userId = user.id;
    console.log(req.session)
    res.json({
      message: 'Login successful',
      user
    });
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

router.get('/sessionData', asyncHandler(async (req, res) => {
  try {
    res.json({ sessionData: req.session });
    console.log(req.session)
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

export default router;
