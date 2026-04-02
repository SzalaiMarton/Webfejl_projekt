import ApiService from './ApiService.js';

/**
 * Comment Service - Hozzászólások kezelése
 */
class CommentService {
  /**
   * Issue hozzászólásainak lekérése
   */
  static async getIssueComments(issueId) {
    try {
      const response = await ApiService.get(`/comments/issue/${issueId}`);
      return response.comments;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Új hozzászólás létrehozása
   */
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

  /**
   * Hozzászólás módosítása
   */
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

  /**
   * Hozzászólás törlése
   */
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
