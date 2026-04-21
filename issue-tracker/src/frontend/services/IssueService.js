import ApiService from './ApiService.js';
import AuthService from './AuthService.js';

class IssueService {
  static async getCurrentUserIssues() {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        console.log("Failed to fetch current user's projects.");
        return;
      }

      const dataIds = [...currentUser.createdIssues, ...currentUser.assignedIssues];
      const data = await Promise.all(
        dataIds.map((value) => IssueService.getIssueById(value))
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllIssues(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.projectId) queryParams.append('projectId', filters.projectId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const endpoint = `/issues${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await ApiService.get(endpoint);
      return response.issues;
    } catch (error) {
      throw error;
    }
  }

  static async getIssueById(issueId) {
    try {
      const response = await ApiService.get(`/issues/${issueId}`);
      return response.issue;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectIssues(projectId, filters = {}) {
    return this.getAllIssues({ ...filters, projectId });
  }

  static async createIssue(projectId, title, description, priority = 'medium', labels = []) {
    try {
      const response = await ApiService.post('/issues', {
        projectId,
        title,
        description,
        priority,
        labels,
      });
      return response.issue;
    } catch (error) {
      throw error;
    }
  }

  static async updateIssue(issueId, updates) {
    try {
      const response = await ApiService.patch(`/issues/${issueId}`, updates);
      return response.issue;
    } catch (error) {
      throw error;
    }
  }

  static async deleteIssue(issueId) {
    try {
      const response = await ApiService.delete(`/issues/${issueId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async assignIssue(issueId, userId) {
    try {
      const response = await ApiService.patch(`/issues/${issueId}/assign`, { userId });
      return response.issue;
    } catch (error) {
      throw error;
    }
  }

  static async unassignIssue(issueId) {
    try {
      const response = await ApiService.patch(`/issues/${issueId}/unassign`);
      return response.issue;
    } catch (error) {
      throw error;
    }
  }

  static async updateIssueLabels(issueId, labelId, action) {
    try {
      const response = await ApiService.patch(`/issues/${issueId}/labels`, {
        labelId,
        action,
      });
      return response.issue;
    } catch (error) {
      throw error;
    }
  }
}

export default IssueService;
