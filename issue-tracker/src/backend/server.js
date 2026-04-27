import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sessionStorage from "./src/utils/session_storage.js"
import 'dotenv/config'; 

import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import issueRoutes from './src/routes/issueRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import labelRoutes from './src/routes/labelRoutes.js';
import backendRoutes from './src/routes/backendRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

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
    secure: isProduction,
    sameSite: 'lax',
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/server', backendRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export async function startServer() {
  try {
    await db.initialize();

    const server = app.listen(PORT, () => {
      console.log(`\nBackend server started successfully!`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(() => {
    process.exit(1);
  });
}

export default app;
