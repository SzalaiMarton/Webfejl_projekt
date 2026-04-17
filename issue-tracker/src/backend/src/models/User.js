export class User {
  constructor(id, username, email, password, role = 'user', avatar = null) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.avatar = avatar;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();

    this.createdProjects = [];
    this.assignedProjects = [];

    this.createdIssues = [];
    this.assignedIssues = [];

    this.createdComments = [];
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  static fromJSON(data) {
    const user = new User(data.id, data.username, data.email, data.password, data.role, data.avatar);
    user.createdAt = data.createdAt || user.createdAt;
    user.updatedAt = data.updatedAt || user.updatedAt;
    user.createdProjects = data.createdProjects || [];
    user.assignedProjects = data.assignedProjects || [];
    user.createdIssues = data.createdIssues || [];
    user.assignedIssues = data.assignedIssues || [];
    user.createdComments = data.createdComments || [];
    return user;
  }
}
