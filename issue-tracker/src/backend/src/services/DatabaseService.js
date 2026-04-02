import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');

/**
 * DatabaseService
 * Feladata: JSON fájlok kezelése az adatokhoz
 * Ez biztosítja a perzisztenciát az alkalmazásban
 */
class DatabaseService {
  constructor() {
    this.data = {
      users: [],
      projects: [],
      issues: [],
      comments: [],
      labels: [],
      attachments: []
    };
    this.isInitialized = false;
  }

  /**
   * Adatbázis inicializálása - betöltés fájlokból vagy üres alapértékek
   */
  async initialize() {
    try {
      // Fájlok létrehozása, ha nem léteznek
      await this.ensureDataFilesExist();
      
      // Adatok betöltése
      for (const [key, _] of Object.entries(this.data)) {
        try {
          const filePath = path.join(DATA_DIR, `${key}.json`);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const loadedData = JSON.parse(fileContent || '[]');
          
          // Convert users to User instances to preserve password property
          if (key === 'users') {
            this.data[key] = loadedData.map(userData => User.fromJSON(userData));
          } else {
            this.data[key] = loadedData;
          }
        } catch (error) {
          console.log(`Data file ${key}.json will be created on first write`);
        }
      }

      this.isInitialized = true;
      console.log('✓ Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * Biztosítja, hogy az adatkönyvtár és fájlok léteznek
   */
  async ensureDataFilesExist() {
    try {
      // Könyvtár létrehozása, ha nem létezik
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Adatfájlok üres tömbbel inicializálása, ha nem léteznek
      for (const key of Object.keys(this.data)) {
        const filePath = path.join(DATA_DIR, `${key}.json`);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }
      }
    } catch (error) {
      console.error('Error ensuring data files exist:', error);
      throw error;
    }
  }

  /**
   * Adatok mentése fájlba (JSON)
   */
  async saveToFile(dataType) {
    try {
      const filePath = path.join(DATA_DIR, `${dataType}.json`);
      
      // Special handling for users to preserve passwords
      let dataToSave = this.data[dataType];
      if (dataType === 'users') {
        dataToSave = dataToSave.map(user => {
          // Convert User instance to plain object with all properties including password
          if (user.password) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              password: user.password,
              role: user.role,
              avatar: user.avatar,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt
            };
          }
          return user;
        });
      }
      
      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
    } catch (error) {
      console.error(`Error saving ${dataType} to file:`, error);
      throw error;
    }
  }

  /**
   * Egész adatbázis mentése
   */
  async saveAll() {
    try {
      for (const key of Object.keys(this.data)) {
        await this.saveToFile(key);
      }
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  // ===== USERS =====

  getAllUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(user => user.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  getUserByUsername(username) {
    return this.data.users.find(user => user.username === username);
  }

  async createUser(user) {
    this.data.users.push(user);
    await this.saveToFile('users');
    return user;
  }

  async updateUser(id, updates) {
    const userIndex = this.data.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    const updatedUser = { ...this.data.users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    this.data.users[userIndex] = updatedUser;
    await this.saveToFile('users');
    return updatedUser;
  }

  async deleteUser(id) {
    const userIndex = this.data.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    const deletedUser = this.data.users.splice(userIndex, 1)[0];
    await this.saveToFile('users');
    return deletedUser;
  }

  // ===== PROJECTS =====

  getAllProjects() {
    return this.data.projects;
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === id);
  }

  getProjectsByOwnerId(ownerId) {
    return this.data.projects.filter(p => p.ownerId === ownerId);
  }

  async createProject(project) {
    this.data.projects.push(project);
    await this.saveToFile('projects');
    return project;
  }

  async updateProject(id, updates) {
    const projectIndex = this.data.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) return null;
    
    const updatedProject = { ...this.data.projects[projectIndex], ...updates, updatedAt: new Date().toISOString() };
    this.data.projects[projectIndex] = updatedProject;
    await this.saveToFile('projects');
    return updatedProject;
  }

  async deleteProject(id) {
    const projectIndex = this.data.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) return null;
    
    const deletedProject = this.data.projects.splice(projectIndex, 1)[0];
    await this.saveToFile('projects');
    
    // Törlés az issue-ből is (cascade delete)
    const issuesToDelete = this.data.issues.filter(i => i.projectId === id);
    for (const issue of issuesToDelete) {
      await this.deleteIssue(issue.id);
    }
    
    return deletedProject;
  }

  // ===== ISSUES =====

  getAllIssues() {
    return this.data.issues;
  }

  getIssueById(id) {
    return this.data.issues.find(i => i.id === id);
  }

  getIssuesByProjectId(projectId) {
    return this.data.issues.filter(i => i.projectId === projectId);
  }

  async createIssue(issue) {
    this.data.issues.push(issue);
    await this.saveToFile('issues');
    return issue;
  }

  async updateIssue(id, updates) {
    const issueIndex = this.data.issues.findIndex(i => i.id === id);
    if (issueIndex === -1) return null;
    
    const updatedIssue = { ...this.data.issues[issueIndex], ...updates, updatedAt: new Date().toISOString() };
    this.data.issues[issueIndex] = updatedIssue;
    await this.saveToFile('issues');
    return updatedIssue;
  }

  async deleteIssue(id) {
    const issueIndex = this.data.issues.findIndex(i => i.id === id);
    if (issueIndex === -1) return null;
    
    const deletedIssue = this.data.issues.splice(issueIndex, 1)[0];
    await this.saveToFile('issues');
    
    // Törlés a comment-ekből is (cascade delete)
    const commentsToDelete = this.data.comments.filter(c => c.issueId === id);
    for (const comment of commentsToDelete) {
      await this.deleteComment(comment.id);
    }
    
    return deletedIssue;
  }

  // ===== COMMENTS =====

  getAllComments() {
    return this.data.comments;
  }

  getCommentById(id) {
    return this.data.comments.find(c => c.id === id);
  }

  getCommentsByIssueId(issueId) {
    return this.data.comments.filter(c => c.issueId === issueId);
  }

  async createComment(comment) {
    this.data.comments.push(comment);
    await this.saveToFile('comments');
    return comment;
  }

  async updateComment(id, updates) {
    const commentIndex = this.data.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return null;
    
    const updatedComment = { ...this.data.comments[commentIndex], ...updates, updatedAt: new Date().toISOString() };
    this.data.comments[commentIndex] = updatedComment;
    await this.saveToFile('comments');
    return updatedComment;
  }

  async deleteComment(id) {
    const commentIndex = this.data.comments.findIndex(c => c.id === id);
    if (commentIndex === -1) return null;
    
    const deletedComment = this.data.comments.splice(commentIndex, 1)[0];
    await this.saveToFile('comments');
    return deletedComment;
  }

  // ===== LABELS =====

  getAllLabels() {
    return this.data.labels;
  }

  getLabelById(id) {
    return this.data.labels.find(l => l.id === id);
  }

  getLabelsByProjectId(projectId) {
    return this.data.labels.filter(l => l.projectId === projectId);
  }

  async createLabel(label) {
    this.data.labels.push(label);
    await this.saveToFile('labels');
    return label;
  }

  async updateLabel(id, updates) {
    const labelIndex = this.data.labels.findIndex(l => l.id === id);
    if (labelIndex === -1) return null;
    
    const updatedLabel = { ...this.data.labels[labelIndex], ...updates, updatedAt: new Date().toISOString() };
    this.data.labels[labelIndex] = updatedLabel;
    await this.saveToFile('labels');
    return updatedLabel;
  }

  async deleteLabel(id) {
    const labelIndex = this.data.labels.findIndex(l => l.id === id);
    if (labelIndex === -1) return null;
    
    const deletedLabel = this.data.labels.splice(labelIndex, 1)[0];
    await this.saveToFile('labels');
    return deletedLabel;
  }

  // ===== ATTACHMENTS =====

  getAllAttachments() {
    return this.data.attachments;
  }

  getAttachmentById(id) {
    return this.data.attachments.find(a => a.id === id);
  }

  getAttachmentsByIssueId(issueId) {
    return this.data.attachments.filter(a => a.issueId === issueId);
  }

  getAttachmentsByCommentId(commentId) {
    return this.data.attachments.filter(a => a.commentId === commentId);
  }

  async createAttachment(attachment) {
    this.data.attachments.push(attachment);
    await this.saveToFile('attachments');
    return attachment;
  }

  async deleteAttachment(id) {
    const attachmentIndex = this.data.attachments.findIndex(a => a.id === id);
    if (attachmentIndex === -1) return null;
    
    const deletedAttachment = this.data.attachments.splice(attachmentIndex, 1)[0];
    await this.saveToFile('attachments');
    return deletedAttachment;
  }
}

// Singleton instance
const db = new DatabaseService();

export default db;
