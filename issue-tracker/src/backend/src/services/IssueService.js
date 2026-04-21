import db from './DatabaseService.js';
import { Issue } from '../models/Issue.js';
import { v4 as uuidv4 } from 'uuid';

class IssueService {
  async createIssue(projectId, title, description, createdById, priority = 'medium', labels = []) {
    if (!projectId || !title) {
      throw new Error('Project ID and title are required');
    }

    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const issue = new Issue(
      uuidv4(),
      projectId,
      title,
      description || '',
      createdById,
      priority,
      'open',
      null,
      labels
    );

    const created = await db.createIssue(issue);

    try {
      const user = db.getUserById(createdById);
      if (user) {
        await db.updateUser(createdById, {
          createdIssues: [...(user.createdIssues || []), created.id]
        });
      }
    } catch (err) {
      console.error('Failed to bind issue to user:', err);
    }

    return created;
  }

  getAllIssues(filters = {}) {
    let issues = db.getAllIssues();

    if (filters.projectId) {
      issues = issues.filter(i => i.projectId === filters.projectId);
    }

    if (filters.priority) {
      issues = issues.filter(i => i.priority === filters.priority);
    }

    if (filters.status) {
      issues = issues.filter(i => i.status === filters.status);
    }

    if (filters.labels && filters.labels.length > 0) {
      issues = issues.filter(i => filters.labels.some(label => i.labels.includes(label)));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      issues = issues.filter(i => 
        i.title.toLowerCase().includes(searchLower) || 
        i.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sortBy) {
      issues.sort((a, b) => {
        if (filters.sortBy === 'createdAt') {
          return filters.sortOrder === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (filters.sortBy === 'priority') {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });
    }

    return issues;
  }

  getIssueById(id) {
    const issue = db.getIssueById(id);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return issue;
  }

  getProjectIssues(projectId, filters = {}) {
    const project = db.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    return this.getAllIssues({ ...filters, projectId });
  }

  async updateIssue(id, updates) {
    const issue = db.getIssueById(id);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const allowedUpdates = ['projectId', 'title', 'description', 'priority', 'status', 'assignedToId', 'labels'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    return await db.updateIssue(id, validUpdates);
  }

  async deleteIssue(id) {
    const issue = db.getIssueById(id);
    if (!issue) {
      throw new Error('Issue not found');
    }

    return await db.deleteIssue(id);
  }

  async assignIssue(issueId, userId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove issue from previous assignee if exists
    if (issue.assignedToId) {
      try {
        const prevUser = db.getUserById(issue.assignedToId);
        if (prevUser) {
          await db.updateUser(prevUser.id, {
            assignedIssues: (prevUser.assignedIssues || []).filter(i => i !== issueId)
          });
        }
      } catch (e) {
        console.error('Failed to update previous assignee:', e);
      }
    }

    // Assign to new user
    const updatedIssue = await db.updateIssue(issueId, { assignedToId: userId });

    try {
      const freshUser = db.getUserById(userId);
      await db.updateUser(userId, {
        assignedIssues: [...(freshUser.assignedIssues || []), issueId]
      });
    } catch (err) {
      console.error('Failed to add issue to user.assignedIssues', err);
    }

    return updatedIssue;
  }

  async unassignIssue(issueId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const prevAssignee = issue.assignedToId;
    const updatedIssue = await db.updateIssue(issueId, { assignedToId: null });

    if (prevAssignee) {
      try {
        const prevUser = db.getUserById(prevAssignee);
        if (prevUser) {
          await db.updateUser(prevAssignee, {
            assignedIssues: (prevUser.assignedIssues || []).filter(i => i !== issueId)
          });
        }
      } catch (err) {
        console.error('Failed to remove issue from previous assignee:', err);
      }
    }

    return updatedIssue;
  }

  async addLabelToIssue(issueId, labelId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const label = db.getLabelById(labelId);
    if (!label) {
      throw new Error('Label not found');
    }

    if (!issue.labels.includes(labelId)) {
      issue.labels.push(labelId);
      return await db.updateIssue(issueId, { labels: issue.labels });
    }

    return issue;
  }

  async removeLabelFromIssue(issueId, labelId) {
    const issue = db.getIssueById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const updatedLabels = issue.labels.filter(id => id !== labelId);
    return await db.updateIssue(issueId, { labels: updatedLabels });
  }
}

export default new IssueService();
