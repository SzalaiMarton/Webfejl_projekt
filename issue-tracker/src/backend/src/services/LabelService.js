import db from './DatabaseService.js';
import { Label } from '../models/Label.js';
import { v4 as uuidv4 } from 'uuid';

class LabelService {
  async createLabel(projectId, name, color, createdById) {
    if (!projectId || !name || !color || !createdById) {
      throw new Error('Project ID, name, color, and creator are required');
    }

    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error('Invalid hex color code');
    }

    const label = new Label(uuidv4(), projectId, name.trim(), color, createdById);
    return await db.createLabel(label);
  }

  getAllLabels() {
    return db.getAllLabels();
  }

  getLabelById(id) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }
    return label;
  }

  getProjectLabels(projectId) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return db.getLabelsByProjectId(projectId);
  }

  async updateLabel(id, updates) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }

    if (updates.color && !/^#[0-9A-F]{6}$/i.test(updates.color)) {
      throw new Error('Invalid hex color code');
    }

    const allowedUpdates = ['name', 'color'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateLabel(id, validUpdates);
  }

  async deleteLabel(id) {
    const label = db.getLabelById(id);
    if (!label) {
      throw new Error('Label not found');
    }

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
