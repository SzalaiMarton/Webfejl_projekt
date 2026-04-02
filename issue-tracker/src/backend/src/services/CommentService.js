import db from './DatabaseService.js';
import { Comment } from '../models/Comment.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * CommentService
 * Comment-ek kezelése: CREATE, READ, UPDATE, DELETE
 */
class CommentService {
  /**
   * Comment létrehozása
   */
  async createComment(issueId, authorId, content) {
    if (!issueId || !content) {
      throw new Error('Issue ID and content are required');
    }

    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const user = db.getUserById(authorId);
    if (!user) {
      throw new Error('User not found');
    }

    const comment = new Comment(uuidv4(), issueId, authorId, content);
    return await db.createComment(comment);
  }

  /**
   * Összes comment lekérése
   */
  getAllComments() {
    return db.getAllComments();
  }

  /**
   * Comment lekérése ID alapján
   */
  getCommentById(id) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  /**
   * Issue comment-jeinek lekérése
   */
  getIssueComments(issueId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return db.getCommentsByIssueId(issueId);
  }

  /**
   * Comment szerkesztése
   */
  async updateComment(id, updates) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Csak a tartalom szerkeszthető
    const allowedUpdates = ['content'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateComment(id, validUpdates);
  }

  /**
   * Comment törlése
   */
  async deleteComment(id) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    return await db.deleteComment(id);
  }
}

export default new CommentService();
