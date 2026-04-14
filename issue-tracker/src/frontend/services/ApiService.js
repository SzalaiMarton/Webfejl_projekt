import API_BASE_URL from '../config/apiConfig.js';

class ApiService {
  static async get(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`GET ${endpoint} failed: ${error.message}`);
    }
  }

  static async post(endpoint, data = {}, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: "include",
        body: JSON.stringify(data),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`POST ${endpoint} failed: ${error.message}`);
    }
  }

  static async patch(endpoint, data = {}, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`PATCH ${endpoint} failed: ${error.message}`);
    }
  }

  static async delete(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include',
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`DELETE ${endpoint} failed: ${error.message}`);
    }
  }

  static async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage = data.error || data.message || 'Unknown error';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  static getAuthHeaders() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
    } catch (e) {
      return {};
    }
  }

  
}

export default ApiService;
