import ApiService from './ApiService.js';

/**
 * Project Service - Projektek kezelése
 */
class ProjectService {
  /**
   * Összes projekt lekérése
   */
  static async getAllProjects() {
    try {
      const response = await ApiService.get('/projects');
      return response.projects;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Projekt lekérése ID alapján
   */
  static async getProjectById(projectId) {
    try {
      const response = await ApiService.get(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Új projekt létrehozása
   */
  static async createProject(name, description) {
    try {
      const response = await ApiService.post('/projects', {
        name,
        description,
      });
      return response.project;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Projekt módosítása
   */
  static async updateProject(projectId, updates) {
    try {
      const response = await ApiService.patch(`/projects/${projectId}`, updates);
      return response.project;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Projekt törlése
   */
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
