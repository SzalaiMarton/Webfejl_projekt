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
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  static fromJSON(data) {
    return new User(data.id, data.username, data.email, data.password, data.role, data.avatar);
  }
}
