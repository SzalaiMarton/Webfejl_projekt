import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import issueRoutes from './src/routes/issueRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import labelRoutes from './src/routes/labelRoutes.js';

// Import middleware
import { errorHandler } from './src/middleware/errorHandler.js';

// Import services
import db from './src/services/DatabaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database
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
      console.log(`\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
