import ApiService from './ApiService.js';

class LabelService {
  static async getAllLabels() {
    try {
      const response = await ApiService.get('/labels');
      return response.labels;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectLabels(projectId) {
    try {
      const response = await ApiService.get(`/labels/project/${projectId}`);
      return response.labels;
    } catch (error) {
      throw error;
    }
  }

  static async createLabel(projectId, name, color) {
    try {
      const response = await ApiService.post('/labels', {
        projectId,
        name,
        color,
      });
      return response.label;
    } catch (error) {
      throw error;
    }
  }

  static async updateLabel(labelId, updates) {
    try {
      const response = await ApiService.patch(`/labels/${labelId}`, updates);
      return response.label;
    } catch (error) {
      throw error;
    }
  }

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
