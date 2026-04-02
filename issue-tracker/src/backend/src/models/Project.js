/**
 * Project Model
 * Projekt entitás - issue-kat csoportosítja
 */
export class Project {
  constructor(id, name, description, ownerId, status = 'active') {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId; // User.id
    this.status = status; // 'active' | 'archived' | 'completed'
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const project = new Project(data.id, data.name, data.description, data.ownerId, data.status);
    project.createdAt = data.createdAt;
    project.updatedAt = data.updatedAt;
    return project;
  }
}
