const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userService = {
  getAllUsers: async () => {
    return await User.find({}).select('-password').sort({ createdAt: -1 });
  },

  getUserById: async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  updateUser: async (id, updateData) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, email, role, department, phone, status, password } = updateData;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (department) user.department = department;
    if (phone) user.phone = phone;
    if (status) user.status = status;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return user.toObject({ transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }});
  },

  deleteUser: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.deleteOne();
    return { message: 'User deleted successfully' };
  },

  getUserPerformance: async (id) => {
    const Task = require('../models/Task');
    
    const tasks = await Task.find({ assignedTo: id });
    
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
    
    stats.completionRate = tasks.length > 0 ? Math.round((stats.completed / tasks.length) * 100) : 0;
    
    return stats;
  },
};

module.exports = userService;
