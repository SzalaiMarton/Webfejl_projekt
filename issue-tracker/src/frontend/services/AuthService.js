import ApiService from './ApiService.js';

class AuthService {
  static async login(email, password) {
    try {
      const response = await ApiService.post('/auth/login', {
        email,
        password,
      });

      if (response.user) {
        localStorage.setItem('userId', JSON.stringify(response.user.id));
        localStorage.setItem('expiresAt', response.expiresAt);
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
      localStorage.removeItem('userId');
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
      return null;
    }
  }

  static logout() {
    ApiService.post('/auth/logout').catch(() => {});
    localStorage.removeItem('userId');
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
  }

  static getCurrentUserFromStorage() {
    const user = localStorage.getItem('userId');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    if (!localStorage.getItem('userId')) {
      return false;
    }
    const expiresAt = localStorage.getItem('expiresAt');
    return expiresAt - Date.now() > 0;
  }
}

export default AuthService;
