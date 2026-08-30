import Api from './api';

const taskService = {
  getAllTasks: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const data = await Api.get(`/tasks${queryString ? `?${queryString}` : ''}`);
    return data.tasks || data;
  },

  getTaskById: async (id) => {
    return await Api.get(`/tasks/${id}`);
  },

  createTask: async (taskData) => {
    return await Api.post('/tasks', taskData);
  },

  updateTask: async (id, taskData) => {
    return await Api.put(`/tasks/${id}`, taskData);
  },

  deleteTask: async (id) => {
    return await Api.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id, status) => {
    return await Api.put(`/tasks/${id}`, { status });
  },

  addComment: async (taskId, commentData) => {
    return await Api.post(`/tasks/${taskId}/comments`, commentData);
  },

  getComments: async (taskId) => {
    return await Api.get(`/tasks/${taskId}/comments`);
  },

  deleteComment: async (taskId, commentId) => {
    return await Api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },

  uploadAttachment: async (taskId, formData) => {
    return await Api.upload(`/tasks/${taskId}/attachments`, formData);
  },

  getAttachments: async (taskId) => {
    return await Api.get(`/tasks/${taskId}/attachments`);
  },

  deleteAttachment: async (taskId, attachmentId) => {
    return await Api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  },

  getMyTasks: async () => {
    return await Api.get('/tasks/my');
  },

  getTaskStats: async () => {
    return await Api.get('/tasks/stats');
  },
};

export default taskService;
