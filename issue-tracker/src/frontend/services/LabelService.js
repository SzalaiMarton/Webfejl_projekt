import ApiService from './ApiService.js';

/**
 * Label Service - Címkék kezelése
 */
class LabelService {
  /**
   * Összes label lekérése
   */
  static async getAllLabels() {
    try {
      const response = await ApiService.get('/labels');
      return response.labels;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Projekt labeljéinak lekérése
   */
  static async getProjectLabels(projectId) {
    try {
      const response = await ApiService.get(`/labels/project/${projectId}`);
      return response.labels;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Új label létrehozása
   */
  static async createLabel(projectId, name, color, description = '') {
    try {
      const response = await ApiService.post('/labels', {
        projectId,
        name,
        color,
        description,
      });
      return response.label;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Label módosítása
   */
  static async updateLabel(labelId, updates) {
    try {
      const response = await ApiService.patch(`/labels/${labelId}`, updates);
      return response.label;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Label törlése
   */
  static async deleteLabel(labelId) {
    try {
      const response = await ApiService.delete(`/labels/${labelId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default LabelService;
