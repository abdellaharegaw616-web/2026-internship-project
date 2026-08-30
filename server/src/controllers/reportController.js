const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { Parser } = require('json2csv');

// @desc    Export project report
// @route   GET /api/reports/projects/:projectId
// @access  Private
const exportProjectReport = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    const project = await Project.findById(req.params.projectId)
      .populate('teamMembers', 'name email department')
      .populate('createdBy', 'name');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');

    const reportData = {
      project: {
        title: project.title,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate,
        endDate: project.endDate,
        progress: project.progress,
        createdBy: project.createdBy?.name,
        teamMembers: project.teamMembers.map(m => ({
          name: m.name,
          email: m.email,
          department: m.department,
        })),
      },
      tasks: tasks.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo?.name,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
      })),
      statistics: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Done').length,
        inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
        todoTasks: tasks.filter(t => t.status === 'Todo').length,
      },
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      res.json({ success: true, report: reportData });
    } else if (format === 'csv') {
      const fields = [
        'title', 'status', 'priority', 'assignedTo', 'dueDate', 'createdAt'
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(reportData.tasks);
      
      res.header('Content-Type', 'text/csv');
      res.attachment(`project-${project.title}-report.csv`);
      res.send(csv);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use json or csv' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export task report
// @route   GET /api/reports/tasks
// @access  Private
const exportTaskReport = async (req, res, next) => {
  try {
    const { format = 'json', status, priority, assignedTo, project } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (project) query.project = project;

    // TeamMembers only see their own tasks
    if (req.user.role === 'TeamMember') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    const reportData = {
      tasks: tasks.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        project: task.project?.title,
        assignedTo: task.assignedTo?.name,
        assignedToEmail: task.assignedTo?.email,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      statistics: {
        totalTasks: tasks.length,
        byStatus: {
          todo: tasks.filter(t => t.status === 'Todo').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          review: tasks.filter(t => t.status === 'Review').length,
          done: tasks.filter(t => t.status === 'Done').length,
        },
        byPriority: {
          low: tasks.filter(t => t.priority === 'Low').length,
          medium: tasks.filter(t => t.priority === 'Medium').length,
          high: tasks.filter(t => t.priority === 'High').length,
          urgent: tasks.filter(t => t.priority === 'Urgent').length,
        },
      },
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      res.json({ success: true, report: reportData });
    } else if (format === 'csv') {
      const fields = [
        'title', 'description', 'status', 'priority', 'project',
        'assignedTo', 'assignedToEmail', 'dueDate', 'createdAt', 'updatedAt'
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(reportData.tasks);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('tasks-report.csv');
      res.send(csv);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use json or csv' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export team report
// @route   GET /api/reports/team
// @access  Private (Admin/ProjectManager only)
const exportTeamReport = async (req, res, next) => {
  try {
    const { format = 'json', department } = req.query;
    const query = {};

    if (department) query.department = department;

    const users = await User.find(query)
      .select('name email department role createdAt');

    const teamData = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ assignedTo: user._id });
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
        
        return {
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          totalTasks: tasks.length,
          completedTasks,
          inProgressTasks,
          completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
          joinedAt: user.createdAt,
        };
      })
    );

    const reportData = {
      team: teamData,
      statistics: {
        totalMembers: users.length,
        totalTasks: teamData.reduce((sum, m) => sum + m.totalTasks, 0),
        totalCompleted: teamData.reduce((sum, m) => sum + m.completedTasks, 0),
        averageCompletionRate: teamData.length > 0 
          ? Math.round(teamData.reduce((sum, m) => sum + m.completionRate, 0) / teamData.length)
          : 0,
      },
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      res.json({ success: true, report: reportData });
    } else if (format === 'csv') {
      const fields = [
        'name', 'email', 'department', 'role', 'totalTasks',
        'completedTasks', 'inProgressTasks', 'completionRate', 'joinedAt'
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(reportData.team);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('team-report.csv');
      res.send(csv);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use json or csv' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Export project summary report
// @route   GET /api/reports/projects-summary
// @access  Private (Admin/ProjectManager only)
const exportProjectsSummary = async (req, res, next) => {
  try {
    const { format = 'json', status } = req.query;
    const query = {};

    if (status) query.status = status;

    const projects = await Project.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const projectsData = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        
        return {
          title: project.title,
          description: project.description,
          status: project.status,
          priority: project.priority,
          progress: project.progress,
          startDate: project.startDate,
          endDate: project.endDate,
          createdBy: project.createdBy?.name,
          totalTasks: tasks.length,
          completedTasks,
          completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
          createdAt: project.createdAt,
        };
      })
    );

    const reportData = {
      projects: projectsData,
      statistics: {
        totalProjects: projects.length,
        byStatus: {
          notStarted: projects.filter(p => p.status === 'Not Started').length,
          inProgress: projects.filter(p => p.status === 'In Progress').length,
          onHold: projects.filter(p => p.status === 'On Hold').length,
          completed: projects.filter(p => p.status === 'Completed').length,
        },
        totalTasks: projectsData.reduce((sum, p) => sum + p.totalTasks, 0),
        totalCompleted: projectsData.reduce((sum, p) => sum + p.completedTasks, 0),
      },
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      res.json({ success: true, report: reportData });
    } else if (format === 'csv') {
      const fields = [
        'title', 'description', 'status', 'priority', 'progress',
        'startDate', 'endDate', 'createdBy', 'totalTasks', 'completedTasks',
        'completionRate', 'createdAt'
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(reportData.projects);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('projects-summary-report.csv');
      res.send(csv);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use json or csv' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportProjectReport,
  exportTaskReport,
  exportTeamReport,
  exportProjectsSummary,
};
