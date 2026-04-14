import db from './DatabaseService.js';
import { Comment } from '../models/Comment.js';
import { v4 as uuidv4 } from 'uuid';

class CommentService {
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
    const created = await db.createComment(comment);

    try {
      const user = db.getUserById(authorId);
      if (user) {
        await db.updateUser(authorId, {
          createdComments: [...(user.createdComments || []), created.id]
        });
      }
    } catch (err) {
      console.error('Failed to bind comment to user:', err);
    }

    return created;
  }

  getAllComments() {
    return db.getAllComments();
  }

  getCommentById(id) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  getIssueComments(issueId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return db.getCommentsByIssueId(issueId);
  }

  async updateComment(id, updates) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const allowedUpdates = ['content'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateComment(id, validUpdates);
  }

  async deleteComment(id) {
    const comment = db.getCommentById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    return await db.deleteComment(id);
  }
}

export default new CommentService();
