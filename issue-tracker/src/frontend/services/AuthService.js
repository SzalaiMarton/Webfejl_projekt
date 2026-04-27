import ApiService from './ApiService.js';
import { buildStoredSession, isSessionLocallyValid } from './authHelpers.js';

class AuthService {
  static removeSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('expiresAt');
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
  }

  static createSession(response) {
    const session = buildStoredSession(response);
    localStorage.setItem('userId', session.userId);
    localStorage.setItem('expiresAt', session.expiresAt);
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true, user: response.user } }));
  }

  static async login(email, password) {
    try {
      const response = await ApiService.post('/auth/login', {
        email,
        password
      });

      if (!response.user) {
        throw new Error("User not found.");
      }

        AuthService.createSession(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async register(username, email, password) {
    try {
      const response = await ApiService.post('/auth/register', {
        username,
        email,
        password,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await ApiService.get('/auth/me');
      return response.user;
    } catch (error) {
        AuthService.removeSession();
      return null;
    }
  }

  static logout() {
    ApiService.post('/auth/logout').catch(() => {});
      AuthService.removeSession();
  }

  static getCurrentUserIdFromStorage() {
    const user = localStorage.getItem('userId');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return isSessionLocallyValid();
  }
}

export default AuthService;
