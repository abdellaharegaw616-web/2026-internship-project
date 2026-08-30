import Api from './api';

const userService = {
  getAllUsers: async () => {
    return await Api.get('/users');
  },

  getUserById: async (id) => {
    return await Api.get(`/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await Api.put(`/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await Api.delete(`/users/${id}`);
  },

  getUserPerformance: async (id) => {
    return await Api.get(`/users/${id}/performance`);
  },

  register: async (userData) => {
    return await Api.post('/auth/register', userData);
  },
};

export default userService;
