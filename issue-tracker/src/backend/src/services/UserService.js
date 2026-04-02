import db from './DatabaseService.js';
import { User } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';

/**
 * UserService
 * Felhasználók kezelésé: regisztráció, bejelentkezés, profil
 */
class UserService {
  /**
   * Felhasználó regisztrálása
   */
  registerUser(username, email, password) {
    // Validáció
    if (!validateUsername(username)) {
      throw new Error('Invalid username format');
    }
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }

    // Ellenőrzés, hogy az email vagy username már létezik-e
    if (db.getUserByEmail(email)) {
      throw new Error('Email already exists');
    }
    if (db.getUserByUsername(username)) {
      throw new Error('Username already exists');
    }

    // Új felhasználó létrehozása
    const user = new User(uuidv4(), username, email, password, 'user');
    
    // Elmentés az adatbázisba (async)
    return db.createUser(user);
  }

  /**
   * Bejelentkezés
   */
  loginUser(email, password) {
    const user = db.getUserByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Egyszerű jelszóellenőrzés (valós alkalmazásban: bcrypt)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return user.toJSON();
  }

  /**
   * Felhasználó lekérése ID alapján
   */
  getUserById(id) {
    const user = db.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  /**
   * Összes felhasználó lekérése
   */
  getAllUsers() {
    const users = db.getAllUsers();
    return users.map(u => u.toJSON());
  }

  /**
   * Felhasználó profil frissítése
   */
  async updateUserProfile(userId, updates) {
    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Csak bizonyos mezőket lehet módosítani
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

  /**
   * Felhasználó törlése
   */
  async deleteUser(userId) {
    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Kaskádolt törlés: a felhasználó által létrehozott projektek törlése
    const ownedProjects = db.getProjectsByOwnerId(userId);
    for (const project of ownedProjects) {
      await db.deleteProject(project.id);
    }

    await db.deleteUser(userId);
    return user.toJSON();
  }
}

export default new UserService();
