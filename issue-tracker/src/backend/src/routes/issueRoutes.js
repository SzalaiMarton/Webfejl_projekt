import express from 'express';
import IssueService from '../services/IssueService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/issues
 * Összes issue listázása
 * Query paraméterek: projectId, priority, status, search, sortBy, sortOrder
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const filters = {
      projectId: req.query.projectId,
      priority: req.query.priority,
      status: req.query.status,
      search: req.query.search,
      labels: req.query.labels ? req.query.labels.split(',') : undefined,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    // Üres szűrők eltávolítása
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const issues = IssueService.getAllIssues(filters);
    res.json({ issues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

/**
 * GET /api/issues/:id
 * Issue lekérése ID alapján (részletes nézet)
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);
    res.json({ issue });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

/**
 * POST /api/issues
 * Új issue létrehozása
 * Test: curl -X POST http://localhost:3000/api/issues -H "Content-Type: application/json" -d '{"projectId":"...","title":"...","createdById":"..."}'
 */
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { projectId, title, description, priority, labels } = req.body;

  if (!projectId || !title) {
    return res.status(400).json({
      error: 'Project ID and title are required'
    });
  }

  try {
    const issue = await IssueService.createIssue(
      projectId,
      title,
      description,
      req.userId,
      priority || 'medium',
      labels || []
    );

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * PATCH /api/issues/:id
 * Issue szerkesztése
 */
router.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);

    // Csak az issue létrehozója vagy admin szerkesztheti
    if (issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedIssue = await IssueService.updateIssue(req.params.id, req.body);
    res.json({
      message: 'Issue updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * DELETE /api/issues/:id
 * Issue törlése
 */
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);

    // Csak az issue létrehozója vagy admin törölheti
    if (issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const deletedIssue = await IssueService.deleteIssue(req.params.id);
    res.json({
      message: 'Issue deleted successfully',
      issue: deletedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * PATCH /api/issues/:id/assign
 * Issue hozzárendelése felhasználóhoz
 */
router.patch('/:id/assign', requireAuth, asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const issue = IssueService.getIssueById(req.params.id);

    // Csak az issue létrehozója rendelhet hozzá
    if (issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedIssue = await IssueService.assignIssue(req.params.id, userId);
    res.json({
      message: 'Issue assigned successfully',
      issue: updatedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * PATCH /api/issues/:id/unassign
 * Issue szétrendelése
 */
router.patch('/:id/unassign', requireAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);

    if (issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedIssue = await IssueService.unassignIssue(req.params.id);
    res.json({
      message: 'Issue unassigned successfully',
      issue: updatedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

/**
 * PATCH /api/issues/:id/labels
 * Label hozzáadása vagy eltávolítása
 */
router.patch('/:id/labels', requireAuth, asyncHandler(async (req, res) => {
  const { labelId, action } = req.body;

  if (!labelId || !action || !['add', 'remove'].includes(action)) {
    return res.status(400).json({
      error: 'Label ID and valid action (add/remove) are required'
    });
  }

  try {
    const issue = IssueService.getIssueById(req.params.id);

    if (issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let updatedIssue;
    if (action === 'add') {
      updatedIssue = await IssueService.addLabelToIssue(req.params.id, labelId);
    } else {
      updatedIssue = await IssueService.removeLabelFromIssue(req.params.id, labelId);
    }

    res.json({
      message: `Label ${action}ed successfully`,
      issue: updatedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

export default router;
