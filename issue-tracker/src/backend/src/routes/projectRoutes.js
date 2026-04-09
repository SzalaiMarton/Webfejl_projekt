import express from 'express';
import ProjectService from '../services/ProjectService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  try {
    const projects = ProjectService.getAllProjects();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const project = ProjectService.getProjectById(req.params.id);
    const issues = ProjectService.getProjectIssues(req.params.id);
    const labels = ProjectService.getProjectLabels(req.params.id);

    res.json({
      project,
      issues,
      labels
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const project = await ProjectService.createProject(name, description, req.userId);
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const project = ProjectService.getProjectById(req.params.id);

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedProject = await ProjectService.updateProject(req.params.id, req.body);
    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const project = ProjectService.getProjectById(req.params.id);

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const deletedProject = await ProjectService.deleteProject(req.params.id);
    res.json({
      message: 'Project deleted successfully',
      project: deletedProject
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

export default router;
