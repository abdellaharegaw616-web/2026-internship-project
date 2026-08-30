const Project = require('../models/Project');
const Task = require('../models/Task');
const { calculateProgress } = require('../utils/calculateProgress');

const projectService = {
  createProject: async (projectData) => {
    const project = await Project.create(projectData);
    return project;
  },

  getProjectById: async (projectId) => {
    const project = await Project.findById(projectId)
      .populate('team', 'name')
      .populate('createdBy', 'name email');
    
    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  getAllProjects: async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.team) {
      query.team = filters.team;
    }

    const projects = await Project.find(query)
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return projects;
  },

  updateProject: async (projectId, updateData) => {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('team', 'name');

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  deleteProject: async (projectId) => {
    const project = await Project.findByIdAndDelete(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: projectId });

    return { message: 'Project deleted successfully' };
  },

  getProjectTasks: async (projectId) => {
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    return tasks;
  },

  getProjectStats: async (projectId) => {
    const tasks = await Task.find({ project: projectId });
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Done').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      todo: tasks.filter(t => t.status === 'Todo').length,
      review: tasks.filter(t => t.status === 'Review').length,
      overdue: tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return t.status !== 'Done' && dueDate < new Date();
      }).length,
    };

    stats.progress = calculateProgress(tasks);

    return stats;
  },

  updateProjectProgress: async (projectId) => {
    const tasks = await Task.find({ project: projectId });
    const progress = calculateProgress(tasks);

    const project = await Project.findByIdAndUpdate(
      projectId,
      { progress },
      { new: true }
    );

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },
};

module.exports = projectService;
