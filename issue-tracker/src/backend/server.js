import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sessionStorage from "./src/utils/session_storage.js"

import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import issueRoutes from './src/routes/issueRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import labelRoutes from './src/routes/labelRoutes.js';

import { errorHandler } from './src/middleware/errorHandler.js';

import db from './src/services/DatabaseService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

const storage = new sessionStorage();

app.use(cors({ 
  origin: FRONTEND_URL, 
  credentials: true 
}));
app.use(express.json());

app.use(session({
  name: process.env.SESSION_NAME || 'sid',
  store: storage,
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

async function startServer() {
  try {
    await db.initialize();
    
    app.listen(PORT, () => {
      console.log(`\nBackend server started successfully!`);
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs: http://localhost:${PORT}/api/health`);
      console.log(`\nAvailable endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/projects`);
      console.log(`   POST   /api/projects`);
      console.log(`   GET    /api/issues`);
      console.log(`   POST   /api/issues`);
      console.log(`   GET    /api/labels`);
      console.log(`   POST   /api/labels`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
