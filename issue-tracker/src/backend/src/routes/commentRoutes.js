import express from 'express';
import CommentService from '../services/CommentService.js';
import db from '../services/DatabaseService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireSessionAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const comments = CommentService.getAllComments();
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

router.get('/issue/:issueId', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const comments = CommentService.getIssueComments(req.params.issueId);
    res.json({ comments });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const comment = CommentService.getCommentById(req.params.id);
    res.json({ comment });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

router.post('/issue/:issueId', requireSessionAuth, asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const comment = await CommentService.createComment(
      req.params.issueId,
      req.userId,
      content
    );

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id/assign-issue', requireSessionAuth, asyncHandler(async (req, res) => {
  const { issueId } = req.body;

  if (!issueId) {
    return res.status(400).json({ error: 'Issue ID is required' });
  }

  try {
    const comment = CommentService.getCommentById(req.params.id);
    const currentIssue = db.getIssueById(comment.issueId);
    const targetIssue = db.getIssueById(issueId);

    if (!targetIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const currentProject = currentIssue ? db.getProjectById(currentIssue.projectId) : null;
    const targetProject = db.getProjectById(targetIssue.projectId);
    const isAuthor = comment.authorId === req.userId;
    const ownsCurrentProject = currentProject?.ownerId === req.userId;
    const ownsTargetProject = targetProject?.ownerId === req.userId;

    if (!isAuthor && !ownsCurrentProject && !ownsTargetProject) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedComment = await CommentService.assignCommentToIssue(req.params.id, issueId);
    res.json({
      message: 'Comment assigned to issue successfully',
      comment: updatedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id/assign-user', requireSessionAuth, asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const comment = CommentService.getCommentById(req.params.id);
    const issue = db.getIssueById(comment.issueId);
    const project = issue ? db.getProjectById(issue.projectId) : null;

    if (project?.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Only project owner can reassign comment author' });
    }

    const updatedComment = await CommentService.assignCommentToUser(req.params.id, userId);
    res.json({
      message: 'Comment assigned to user successfully',
      comment: updatedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.patch('/:id', requireSessionAuth, asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const comment = CommentService.getCommentById(req.params.id);

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedComment = await CommentService.updateComment(req.params.id, { content });
    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

router.delete('/:id', requireSessionAuth, asyncHandler(async (req, res) => {
  try {
    const comment = CommentService.getCommentById(req.params.id);

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const deletedComment = await CommentService.deleteComment(req.params.id);
    res.json({
      message: 'Comment deleted successfully',
      comment: deletedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

export default router;
