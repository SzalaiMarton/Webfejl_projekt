import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { MemoryStore } from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { errorHandler } from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/authRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

const storage = new MemoryStore();

app.use(express.json());
app.use(cors({ 
  origin: FRONTEND_URL, 
  credentials: true 
}));

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
    app.listen(PORT, () => {
      console.log(`\nBackend server started successfully!`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
