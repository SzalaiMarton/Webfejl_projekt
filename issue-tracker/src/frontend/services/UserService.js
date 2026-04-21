import ApiService from './ApiService.js';

class UserService {
    static async getAllUsers() {
        try {
            const response = await ApiService.get('/user');
            return response.users;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(userId) {
        try {
            const user = await ApiService.get(`/user/get/${userId}`);
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
