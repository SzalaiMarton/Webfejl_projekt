import API_BASE_URL from '../config/apiConfig.js';
import ApiService from './ApiService.js';
import AuthService from './AuthService.js';

class UserService {
    static async getUserById(userId) {
        try {
            const user = ApiService.get(`/user/get/${userId}`);
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;