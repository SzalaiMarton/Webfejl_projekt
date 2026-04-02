import ApiService from './ApiService.js';

/**
 * Auth Service - Felhasználó hitelesítése és kezelése
 */
class AuthService {
  /**
   * Bejelentkezés
   */
  static async login(email, password) {
    try {
      const response = await ApiService.post('/auth/login', {
        email,
        password,
      });

      // Token mentése
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Dispatch custom event for navbar update
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true, user: response.user } }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Regisztráció
   */
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

  /**
   * Aktuális felhasználó adatainak获取
   */
  static async getCurrentUser() {
    try {
      const response = await ApiService.get('/auth/me');
      return response.user;
    } catch (error) {
      // Ha a token nem érvényes, kijelentkezik
      this.logout();
      throw error;
    }
  }

  /**
   * Kijelentkezés
   */
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event for navbar update
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: false, user: null } }));
  }

  /**
   * Aktuális felhasználó lekérése a localStorage-ből
   */
  static getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Token meglétének ellenőrzése
   */
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default AuthService;
