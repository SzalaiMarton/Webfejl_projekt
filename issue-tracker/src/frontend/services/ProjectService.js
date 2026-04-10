import ApiService from './ApiService.js';

class ProjectService {
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
}

export default ProjectService;
