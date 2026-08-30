const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getProjectHealth = ({ project, tasks }) => {
  const openTasks = tasks.filter(task => task.status !== 'Done');
  const overdueTasks = openTasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date());
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const budgetUsage = project.estimatedBudget > 0
    ? Math.round(((project.actualCost || 0) / project.estimatedBudget) * 100)
    : 0;

  let health = 'Healthy';
  if (project.status === 'On Hold' || overdueTasks.length > 0 || budgetUsage > 100) {
    health = 'At Risk';
  }
  if (overdueTasks.length >= 3 || budgetUsage > 120) {
    health = 'Critical';
  }

  return {
    _id: project._id,
    title: project.title,
    status: project.status,
    priority: project.priority,
    progress,
    totalTasks: tasks.length,
    overdueTasks: overdueTasks.length,
    budgetUsage,
    health,
  };
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';

    // Counts
    const totalTeamMembers = await User.countDocuments();
    const projectFilter = isAdmin
      ? { isArchived: { $ne: true } }
      : { members: req.user._id, isArchived: { $ne: true } };

    const totalProjects = await Project.countDocuments(projectFilter);

    const taskQuery = isAdmin ? {} : { assignedTo: req.user._id };
    const totalTasks = await Task.countDocuments(taskQuery);
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Done' });
    const overdueTasks = await Task.countDocuments({
      ...taskQuery,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() },
    });

    // Tasks by status for donut chart
    const tasksByStatus = await Task.aggregate([
      { $match: taskQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Projects by status for bar chart
    const projectsByStatus = await Project.aggregate([
      { $match: projectFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent activity — collect from tasks and projects
    const recentTasks = await Task.find(taskQuery)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name avatar')
      .populate('project', 'title')
      .select('title status updatedAt');

    const recentProjects = await Project.find(projectFilter)
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title status updatedAt');

    const upcomingTasks = await Task.find({
      ...taskQuery,
      status: { $ne: 'Done' },
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(6)
      .populate('project', 'title')
      .select('title status dueDate project');

    const activeProjects = await Project.find(projectFilter)
      .sort({ updatedAt: -1 })
      .limit(6)
      .select('title status priority estimatedBudget actualCost');

    const activeProjectIds = activeProjects.map(project => project._id);
    const activeProjectTasks = await Task.find({ project: { $in: activeProjectIds } })
      .select('project status dueDate createdAt updatedAt');

    const projectHealth = activeProjects.map(project => getProjectHealth({
      project,
      tasks: activeProjectTasks.filter(task => task.project.toString() === project._id.toString()),
    }));

    const today = startOfDay(new Date());
    const burndownStart = addDays(today, -13);
    const scopedTasks = await Task.find({
      ...taskQuery,
      createdAt: { $lte: addDays(today, 1) },
    }).select('status createdAt updatedAt');

    const burndown = Array.from({ length: 14 }, (_, index) => {
      const day = addDays(burndownStart, index);
      const nextDay = addDays(day, 1);
      const openTasks = scopedTasks.filter(task => {
        const createdBeforeDayEnds = new Date(task.createdAt) < nextDay;
        const completedBeforeDayEnds = task.status === 'Done' && new Date(task.updatedAt) < nextDay;
        return createdBeforeDayEnds && !completedBeforeDayEnds;
      }).length;

      return {
        date: day.toISOString().slice(0, 10),
        openTasks,
      };
    });

    res.json({
      success: true,
      stats: {
        totalTeamMembers,
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
      },
      tasksByStatus,
      projectsByStatus,
      recentTasks,
      recentProjects,
      upcomingTasks,
      projectHealth,
      burndown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team utilization data
// @route   GET /api/dashboard/team-utilization
// @access  Private (Admin/ProjectManager only)
const getTeamUtilization = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } })
      .select('name avatar department role');

    const utilizationData = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ assignedTo: user._id });
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
        const todoTasks = tasks.filter(t => t.status === 'Todo').length;
        const overdueTasks = tasks.filter(t => 
          t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        // Calculate total time spent on tasks (in hours)
        const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.totalTime || 0), 0) / 3600;

        return {
          userId: user._id,
          name: user.name,
          avatar: user.avatar,
          department: user.department,
          role: user.role,
          totalTasks: tasks.length,
          completedTasks,
          inProgressTasks,
          todoTasks,
          overdueTasks,
          completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
          totalTimeSpent: Math.round(totalTimeSpent * 100) / 100,
          workload: tasks.length > 10 ? 'High' : tasks.length > 5 ? 'Medium' : 'Low',
        };
      })
    );

    // Calculate team averages
    const avgCompletionRate = utilizationData.length > 0
      ? Math.round(utilizationData.reduce((sum, u) => sum + u.completionRate, 0) / utilizationData.length)
      : 0;
    const avgTotalTimeSpent = utilizationData.length > 0
      ? Math.round(
        (utilizationData.reduce((sum, u) => sum + u.totalTimeSpent, 0) / utilizationData.length) * 100
      ) / 100
      : 0;

    res.json({
      success: true,
      utilization: utilizationData,
      teamStats: {
        totalMembers: utilizationData.length,
        avgCompletionRate,
        avgTotalTimeSpent,
        highWorkload: utilizationData.filter(u => u.workload === 'High').length,
        mediumWorkload: utilizationData.filter(u => u.workload === 'Medium').length,
        lowWorkload: utilizationData.filter(u => u.workload === 'Low').length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public stats (for login/register page)
// @route   GET /api/dashboard/public-stats
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments({ isArchived: { $ne: true } });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Done' });

    res.json({
      success: true,
      stats: {
        projects: totalProjects,
        tasks: totalTasks,
        completed: completedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getTeamUtilization, getPublicStats };
