import ApiService from './ApiService.js';
import AuthService from './AuthService.js';

class ProjectService {
  static async getCurrentUserProjects() {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        console.log("Failed to fetch current user's projects.");
        return;
      }

      const dataIds = [...currentUser.createdProjects, ...currentUser.assignedProjects];
      const data = await Promise.all(
        dataIds.map((value) => ProjectService.getProjectById(value))
      );
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllProjects() {
    try {
      const response = await ApiService.get('/projects');
      return response.projects;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectById(projectId) {
    try {
      const response = await ApiService.get(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async createProject(name, description) {
    try {
      const response = await ApiService.post('/projects', {
        name,
        description
      });
      return response.project;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateProject(projectId, updates) {
    try {
      const response = await ApiService.patch(`/projects/${projectId}`, updates);
      return response.project;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProject(projectId) {
    try {
      const response = await ApiService.delete(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async assignUserToProject(projectId, userId) {
    try {
      const response = await ApiService.post(`/projects/${projectId}/assign-user`, { userId });
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  static async removeUserFromProject(projectId, userId) {
    try {
      const response = await ApiService.delete(`/projects/${projectId}/assign-user`, {
        body: JSON.stringify({ userId }),
      });
      return response.user;
    } catch (error) {
      throw error;
    }
  }
}

export default ProjectService;
