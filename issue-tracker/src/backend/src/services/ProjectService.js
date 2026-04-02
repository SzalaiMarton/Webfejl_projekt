import db from './DatabaseService.js';
import { Project } from '../models/Project.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * ProjectService
 * Projektek kezelése: CREATE, READ, UPDATE, DELETE
 */
class ProjectService {
  /**
   * Projekt létrehozása
   */
  async createProject(name, description, ownerId) {
    if (!name || name.trim() === '') {
      throw new Error('Project name is required');
    }

    const project = new Project(uuidv4(), name, description || '', ownerId);
    return await db.createProject(project);
  }

  /**
   * Összes projekt lekérése
   */
  getAllProjects() {
    return db.getAllProjects();
  }

  /**
   * Projekt lekérése ID alapján
   */
  getProjectById(id) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  /**
   * Felhasználó projektjei
   */
  getUserProjects(userId) {
    return db.getProjectsByOwnerId(userId);
  }

  /**
   * Projekt szerkesztése
   */
  async updateProject(id, updates) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    // Csak bizonyos mezőket lehet módosítani
    const allowedUpdates = ['name', 'description', 'status'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateProject(id, validUpdates);
  }

  /**
   * Projekt törlése (kaskádolt: törlés az issue-k is)
   */
  async deleteProject(id) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    return await db.deleteProject(id);
  }

  /**
   * Projekt issue-inak lekérése
   */
  getProjectIssues(projectId) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return db.getIssuesByProjectId(projectId);
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
}

export default new ProjectService();
