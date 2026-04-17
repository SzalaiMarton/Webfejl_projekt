import db from './DatabaseService.js';
import { Project } from '../models/Project.js';
import { v4 as uuidv4 } from 'uuid';
import UserService from './UserService.js';

class ProjectService {
  async createProject(name, description, ownerId) {
    if (!name || name.trim() === '') {
      throw new Error('Project name is required');
    }

    const project = new Project(uuidv4(), name, description || '', ownerId);
    try {
      const created = await db.createProject(project);
      const bound = await this.bindProjectToUser(project.id, ownerId);
      if (!bound) {
        await db.deleteProject(project.id);
        throw new Error('Project failed to bind to user.');
      }
      return created;
    } catch (err) {
      throw err;
    }
  }

  async bindProjectToUser(projectId, ownerId) {
    try {
      const user = db.getUserById(ownerId);
      if (!user) {
        throw new Error('User not found');
      }

      const current = Array.isArray(user.createdProjects) ? user.createdProjects : [];
      if (current.includes(projectId)) {
        return user;
      }

      const updated = await db.updateUser(ownerId, {
        createdProjects: [...current, projectId]
      });
      return updated;
    } catch (error) {
      console.error('bindProjectToUser error:', error.message || error);
      return null;
    }
  }

  async assignUserToProject(projectId, userId, byUserId) {
    const project = db.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== byUserId) {
      throw new Error('Only project owner can assign users');
    }

    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    if ((user.assignedProjects || []).includes(projectId)) return user;

    return await db.updateUser(userId, {
      assignedProjects: [...(user.assignedProjects || []), projectId]
    });
  }

  async removeUserFromProject(projectId, userId, byUserId) {
    const project = db.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== byUserId && userId !== byUserId) {
      throw new Error('Unauthorized');
    }

    const user = db.getUserById(userId);
    if (!user) throw new Error('User not found');

    return await db.updateUser(userId, {
      assignedProjects: (user.assignedProjects || []).filter(pid => pid !== projectId)
    });
  }

  getAllProjects() {
    return db.getAllProjects();
  }

  getProjectById(id) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  getUserProjects(userId) {
    return db.getProjectsByOwnerId(userId);
  }

  async updateProject(id, updates) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    const allowedUpdates = ['name', 'description', 'status'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateProject(id, validUpdates);
  }

  async deleteProject(id) {
    const project = db.getProjectById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    return await db.deleteProject(id);
  }

  getProjectIssues(projectId) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return db.getIssuesByProjectId(projectId);
  }

  getProjectLabels(projectId) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return db.getLabelsByProjectId(projectId);
  }

  async addIssues(projectId, issues) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return await db.updateIssue(issues);
  }

  async addLabel(projectId, labels) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return await db.updateLabel(labels);
  }
}

export default new ProjectService();
