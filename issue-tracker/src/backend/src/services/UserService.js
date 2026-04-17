import db from './DatabaseService.js';
import { User } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';

class UserService {
  registerUser(username, email, password) {
    if (!validateUsername(username)) {
      throw new Error('Invalid username format');
    }
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }

    if (db.getUserByEmail(email)) {
      throw new Error('Email already exists');
    }
    if (db.getUserByUsername(username)) {
      throw new Error('Username already exists');
    }
    const user = new User(uuidv4(), username, email, password, 'user');
    
    return db.createUser(user);
  }

  loginUser(email, password) {
    const user = db.getUserByEmail(email);

    if(!user) {
      throw new Error("User not found.");
    }

    if (user.password !== password || !user) {
      throw new Error('Invalid email or password');
    }

    return user.toJSON();
  }

  getUserById(id) {
    const user = db.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  getAllUsers() {
    const users = db.getAllUsers();
    return users.map(u => u.toJSON());
  }

  async updateUserProfile(userId, updates) {
    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allowedUpdates = ['username', 'avatar'];
    const validUpdates = {};
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        validUpdates[key] = updates[key];
      }
    }

    const updatedUser = await db.updateUser(userId, validUpdates);
    return updatedUser.toJSON();
  }

  async deleteUser(userId) {
    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await db.removeProjectsByOwner(userId);

    await db.deleteUser(userId);
    return user.toJSON();
  }
}

export default new UserService();
