import Api from './api';

const projectService = {
  getAllProjects: async () => {
    const data = await Api.get('/projects');
    return data.projects || data;
  },

  getProjectById: async (id) => {
    return await Api.get(`/projects/${id}`);
  },

  createProject: async (projectData) => {
    return await Api.post('/projects', projectData);
  },

  updateProject: async (id, projectData) => {
    return await Api.put(`/projects/${id}`, projectData);
  },

  deleteProject: async (id) => {
    return await Api.delete(`/projects/${id}`);
  },

  getProjectTasks: async (id) => {
    return await Api.get(`/projects/${id}/tasks`);
  },

  getProjectStats: async (id) => {
    return await Api.get(`/projects/${id}/stats`);
  },

  updateProjectProgress: async (id) => {
    return await Api.patch(`/projects/${id}/progress`);
  },
};

export default projectService;
