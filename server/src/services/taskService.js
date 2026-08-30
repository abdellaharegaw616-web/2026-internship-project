const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const { calculateProgress } = require('../utils/calculateProgress');

const taskService = {
  createTask: async (taskData) => {
    const task = await Task.create(taskData);
    
    // Update project progress
    if (task.project) {
      const tasks = await Task.find({ project: task.project });
      const progress = calculateProgress(tasks);
      await Project.findByIdAndUpdate(task.project, { progress });
    }

    return await task.populate('assignedTo', 'name email avatar').populate('project', 'name');
  },

  getTaskById: async (taskId) => {
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name status')
      .populate('comments.author', 'name email avatar');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  },

  getAllTasks: async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.priority) {
      query.priority = filters.priority;
    }
    
    if (filters.project) {
      query.project = filters.project;
    }
    
    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name status')
      .sort({ createdAt: -1 });

    return tasks;
  },

  getMyTasks: async (userId) => {
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name status')
      .sort({ createdAt: -1 });

    return tasks;
  },

  updateTask: async (taskId, updateData) => {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email avatar').populate('project', 'name');

    if (!task) {
      throw new Error('Task not found');
    }

    // Update project progress if task status changed
    if (updateData.status && task.project) {
      const tasks = await Task.find({ project: task.project });
      const progress = calculateProgress(tasks);
      await Project.findByIdAndUpdate(task.project, { progress });
    }

    return task;
  },

  deleteTask: async (taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Delete all comments associated with the task
    await Comment.deleteMany({ task: taskId });

    // Update project progress
    if (task.project) {
      const tasks = await Task.find({ project: task.project });
      const progress = calculateProgress(tasks);
      await Project.findByIdAndUpdate(task.project, { progress });
    }

    return { message: 'Task deleted successfully' };
  },

  addComment: async (taskId, userId, text) => {
    const comment = await Comment.create({
      task: taskId,
      author: userId,
      text,
    });

    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: comment._id }
    });

    return await comment.populate('author', 'name email avatar');
  },

  getComments: async (taskId) => {
    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    return comments;
  },

  deleteComment: async (taskId, commentId, userId) => {
    const comment = await Comment.findOne({ _id: commentId, task: taskId });
    
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check if user is the author or admin
    if (comment.author.toString() !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(commentId);
    await Task.findByIdAndUpdate(taskId, {
      $pull: { comments: commentId }
    });

    return { message: 'Comment deleted successfully' };
  },

  getTaskStats: async () => {
    const tasks = await Task.find();
    
    const stats = {
      total: tasks.length,
      byStatus: {
        Todo: tasks.filter(t => t.status === 'Todo').length,
        'In Progress': tasks.filter(t => t.status === 'In Progress').length,
        Review: tasks.filter(t => t.status === 'Review').length,
        Done: tasks.filter(t => t.status === 'Done').length,
      },
      byPriority: {
        Low: tasks.filter(t => t.priority === 'Low').length,
        Medium: tasks.filter(t => t.priority === 'Medium').length,
        High: tasks.filter(t => t.priority === 'High').length,
        Urgent: tasks.filter(t => t.priority === 'Urgent').length,
      },
      overdue: tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return t.status !== 'Done' && dueDate < new Date();
      }).length,
    };

    return stats;
  },
};

module.exports = taskService;
