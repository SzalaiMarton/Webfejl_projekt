import ApiService from './ApiService.js';

class CommentService {
  static async getIssueComments(issueId) {
    try {
      const response = await ApiService.get(`/comments/issue/${issueId}`);
      return response.comments;
    } catch (error) {
      throw error;
    }
  }

  static async getCommentById(commentId) {
    try {
      const response = await ApiService.get(`/comments/${commentId}`);
      return response.comment;
    } catch (error) {
      throw error;
    }
  }

  static async getUserCommentIds(userId) {
    try {
      const response = await ApiService.get(`/user/${userId}/comment-ids`);
      return response.commentIds || [];
    } catch (error) {
      throw error;
    }
  }

  static async getUserRecentComments(userId, limit = 3) {
    try {
      const ids = await CommentService.getUserCommentIds(userId);
      const comments = await Promise.all(
        ids.map(id => CommentService.getCommentById(id).catch(() => null))
      );
      const valid = comments.filter(c => c !== null && c !== undefined);
      valid.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return valid.slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  static async createComment(issueId, content) {
    try {
      const response = await ApiService.post(`/comments/issue/${issueId}`, {
        content,
      });
      return response.comment;
    } catch (error) {
      throw error;
    }
  }

  static async updateComment(commentId, content) {
    try {
      const response = await ApiService.patch(`/comments/${commentId}`, {
        content,
      });
      return response.comment;
    } catch (error) {
      throw error;
    }
  }

  static async deleteComment(commentId) {
    try {
      const response = await ApiService.delete(`/comments/${commentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default CommentService;
