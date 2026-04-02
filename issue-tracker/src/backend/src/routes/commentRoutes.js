import express from 'express';
import CommentService from '../services/CommentService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/comments
 * Összes comment listázása
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const comments = CommentService.getAllComments();
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

/**
 * GET /api/issues/:issueId/comments
 * Issue comment-jeinek lekérése
 */
router.get('/issue/:issueId', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const comments = CommentService.getIssueComments(req.params.issueId);
    res.json({ comments });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}));

/**
 * POST /api/issues/:issueId/comments
 * Comment hozzáadása az issue-hoz
 */
router.post('/issue/:issueId', requireAuth, asyncHandler(async (req, res) => {
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

/**
 * PATCH /api/comments/:id
 * Comment szerkesztése
 */
router.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const comment = CommentService.getCommentById(req.params.id);

    // Csak a comment szerzője szerkesztheti
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

/**
 * DELETE /api/comments/:id
 * Comment törlése
 */
router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  try {
    const comment = CommentService.getCommentById(req.params.id);

    // Csak a comment szerzője vagy admin törölheti
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
