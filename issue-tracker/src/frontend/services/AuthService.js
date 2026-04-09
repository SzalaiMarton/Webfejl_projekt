import ApiService from './ApiService.js';

class AuthService {
  static async login(email, password) {
    try {
      const response = await ApiService.post('/auth/login', {
        email,
        password,
      });

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', 'authenticated');
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true, user: response.user } }));
      }

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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
      return null;
    }
  }

  static logout() {
    ApiService.post('/auth/logout').catch(() => {});
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
  }

  static getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default AuthService;
