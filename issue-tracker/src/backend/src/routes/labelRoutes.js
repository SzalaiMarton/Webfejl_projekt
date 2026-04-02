import express from 'express';
import LabelService from '../services/LabelService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import ProjectService from '../services/ProjectService.js';

const router = express.Router();

/**
 * GET /api/labels
 * Összes label listázása
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const labels = LabelService.getAllLabels();
    res.json({ labels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

/**
 * GET /api/labels/project/:projectId
 * Projekt label-jeinek lekérése
 */
router.get('/project/:projectId', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const labels = LabelService.getProjectLabels(req.params.projectId);
    res.json({ labels });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

/**
 * POST /api/labels
 * Új label létrehozása
 */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { projectId, name, color, description } = req.body;

  if (!projectId || !name || !color) {
    return res.status(400).json({
      error: 'Project ID, name, and color are required'
    });
  }

  try {
    // Ellenőrzés: a felhasználó a projekt tulajdonosa
    const project = ProjectService.getProjectById(projectId);
    if (project.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const label = await LabelService.createLabel(projectId, name, color, description);
    res.status(201).json({
      message: 'Label created successfully',
      label
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * PATCH /api/labels/:id
 * Label szerkesztése
 */
router.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const label = LabelService.getLabelById(req.params.id);
    const project = ProjectService.getProjectById(label.projectId);

    // Csak a projekt tulajdonosa szerkesztheti
    if (project.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedLabel = await LabelService.updateLabel(req.params.id, req.body);
    res.json({
      message: 'Label updated successfully',
      label: updatedLabel
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * DELETE /api/labels/:id
 * Label törlése
 */
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const label = LabelService.getLabelById(req.params.id);
    const project = ProjectService.getProjectById(label.projectId);

    // Csak a projekt tulajdonosa törölheti
    if (project.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const deletedLabel = await LabelService.deleteLabel(req.params.id);
    res.json({
      message: 'Label deleted successfully',
      label: deletedLabel
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

export default router;
