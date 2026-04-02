import db from './DatabaseService.js';
import { Label } from '../models/Label.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * LabelService
 * Label-ek kezelése: CREATE, READ, DELETE
 */
class LabelService {
  /**
   * Label létrehozása
   */
  async createLabel(projectId, name, color, description = '') {
    if (!projectId || !name || !color) {
      throw new Error('Project ID, name, and color are required');
    }

    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Szín validáció (hex code)
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error('Invalid hex color code');
    }

    const label = new Label(uuidv4(), projectId, name, color, description);
    return await db.createLabel(label);
  }

  /**
   * Összes label lekérése
   */
  getAllLabels() {
    return db.getAllLabels();
  }

  /**
   * Label lekérése ID alapján
   */
  getLabelById(id) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }
    return label;
  }

  /**
   * Projekt label-jeinek lekérése
   */
  getProjectLabels(projectId) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return db.getLabelsByProjectId(projectId);
  }

  /**
   * Label szerkesztése
   */
  async updateLabel(id, updates) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }

    // Szín validáció, ha módosul
    if (updates.color && !/^#[0-9A-F]{6}$/i.test(updates.color)) {
      throw new Error('Invalid hex color code');
    }

    // Csak bizonyos mezőket lehet módosítani
    const allowedUpdates = ['name', 'color', 'description'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateLabel(id, validUpdates);
  }

  /**
   * Label törlése
   */
  async deleteLabel(id) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }

    // Label eltávolítása az issue-kből
    const issues = db.getAllIssues();
    for (const issue of issues) {
      if (issue.labels.includes(id)) {
        const updatedLabels = issue.labels.filter(labelId => labelId !== id);
        await db.updateIssue(issue.id, { labels: updatedLabels });
      }
    }

    return await db.deleteLabel(id);
  }
}

export default new LabelService();
