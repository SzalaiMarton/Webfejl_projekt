import express from 'express';
import IssueService from '../services/IssueService.js';
import db from '../services/DatabaseService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireSessionAuth, optionalAuth } from '../middleware/authMiddleware.js';
import ProjectService from '../services/ProjectService.js';

const router = express.Router();

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

    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const issues = IssueService.getAllIssues(filters);
    res.json({ issues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);
    res.json({ issue });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

router.post('/', requireSessionAuth, asyncHandler(async (req, res) => {
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

    ProjectService.addIssues(projectId, [issue.id]);

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id', requireSessionAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);

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

router.delete('/:id', requireSessionAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);

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

router.patch('/:id/assign', requireSessionAuth, asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const issue = IssueService.getIssueById(req.params.id);
    const project = db.getProjectById(issue.projectId);

    // if assigning someone else, only project owner or issue creator can assign others
    if (userId && userId !== req.userId) {
      if (!project || project.ownerId !== req.userId) {
        return res.status(403).json({ error: 'Only project owner can assign other users' });
      }
    }

    // if self-assign, user must be member of project or project owner or issue creator
    const targetUserId = userId || req.userId;
    const targetUser = db.getUserById(targetUserId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const isMember = (targetUser.assignedProjects || []).includes(issue.projectId);
    if (targetUserId === req.userId && !isMember && project.ownerId !== req.userId && issue.createdById !== req.userId) {
      return res.status(403).json({ error: 'Only project members or owners can self-assign' });
    }

    const updatedIssue = await IssueService.assignIssue(req.params.id, targetUserId);
    res.json({
      message: 'Issue assigned successfully',
      issue: updatedIssue
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id/unassign', requireSessionAuth, asyncHandler(async (req, res) => {
  try {
    const issue = IssueService.getIssueById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // allow unassign if the requester is the assignee (self) or the project owner
    const project = db.getProjectById(issue.projectId);
    const requesterId = req.userId;

    if (issue.assignedToId !== requesterId && project?.ownerId !== requesterId) {
      return res.status(403).json({ error: 'Only assignee or project owner can unassign' });
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

router.patch('/:id/labels', requireSessionAuth, asyncHandler(async (req, res) => {
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
