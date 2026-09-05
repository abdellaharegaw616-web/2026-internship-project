const Project = require('../models/Project');
const ProjectTemplate = require('../models/ProjectTemplate');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendProjectCreatedEmail } = require('../services/emailService');
const { getIO } = require('../config/socket');
const { createNotification } = require('./notificationController');
const path = require('path');
const fs = require('fs');

const attachProgress = async (project) => {
  const tasks = await Task.find({ project: project._id });
  const completed = tasks.filter((t) => t.status === 'Done').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  return { ...project.toObject(), totalTasks: tasks.length, completedTasks: completed, progress };
};

// @desc    Get team members for project assignment
// @route   GET /api/projects/team/members
// @access  Private/Admin/ProjectManager
const getTeamMembers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: { $ne: false } })
      .select('name avatar email role department')
      .sort({ name: 1 });
    res.json({ success: true, members: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { status, priority, search, archived, page = 1, limit = 10 } = req.query;
    const query = {};

    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    if (req.user.role === 'TeamMember' || req.user.role === 'ProjectManager') {
      query.members = req.user._id;
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('members', 'name avatar email role')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const projectsWithProgress = await Promise.all(projects.map(attachProgress));

    res.json({ 
      success: true, 
      count: projects.length, 
      projects: projectsWithProgress,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project with details
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name avatar email role department')
      .populate('createdBy', 'name')
      .populate('activities.user', 'name avatar')
      .populate('attachments.uploadedBy', 'name')
      .populate('costEntries.createdBy', 'name');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // RBAC: Check if ProjectManager or TeamMember is assigned to this project
    if (req.user.role === 'ProjectManager' || req.user.role === 'TeamMember') {
      const isMember = project.members.some(member => member._id.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
      }
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 });

    const tasksByStatus = {
      Todo: tasks.filter((t) => t.status === 'Todo').length,
      'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
      Review: tasks.filter((t) => t.status === 'Review').length,
      Done: tasks.filter((t) => t.status === 'Done').length,
    };
    const progress =
      tasks.length > 0 ? Math.round((tasksByStatus['Done'] / tasks.length) * 100) : 0;

    const daysRemaining = project.endDate
      ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    const budgetVariance = project.estimatedBudget - project.actualCost;

    res.json({
      success: true,
      project: { ...project.toObject(), progress, daysRemaining, budgetVariance },
      tasks,
      tasksByStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin/ProjectManager
const createProject = async (req, res, next) => {
  try {
    const {
      title, description, status, priority, startDate, endDate, members,
      estimatedBudget, milestones,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      members,
      estimatedBudget: estimatedBudget || 0,
      milestones: milestones || [],
      createdBy: req.user._id,
      activities: [{ action: 'Project created', user: req.user._id }],
    });

    await project.populate('members', 'name avatar email role');

    if (members && members.length > 0) {
      for (const memberId of members) {
        const member = await User.findById(memberId);
        if (member?.email) {
          try {
            await sendProjectCreatedEmail(member.email, title, description);
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
          }
        }

        // Create in-app notification for project members
        if (String(memberId) !== String(req.user._id)) {
          try {
            await createNotification(
              memberId,
              'project_invited',
              'Added to Project',
              `You have been added to project "${title}"`,
              project._id,
              'Project',
              `/projects/${project._id}`,
              { projectName: title, createdBy: req.user.name }
            );
          } catch (notifError) {
            console.error('Failed to create notification:', notifError);
          }
        }
      }
    }

    try {
      const io = getIO();
      (members || []).forEach((memberId) => {
        io.to(memberId.toString()).emit('project-created', {
          project,
          message: `New project created: ${title}`,
        });
      });
    } catch (socketError) {
      console.error('Socket error:', socketError);
    }

    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project from template
// @route   POST /api/projects/from-template/:templateId
// @access  Private/Admin/ProjectManager
const createFromTemplate = async (req, res, next) => {
  try {
    const template = await ProjectTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const { title, members, startDate: customStartDate } = req.body;
    const startDate = customStartDate ? new Date(customStartDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + template.defaultDurationDays);

    const milestones = (template.defaultMilestones || []).map((m) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + m.daysOffset);
      return { title: m.title, dueDate, completed: false };
    });

    const project = await Project.create({
      title: title || template.name,
      description: template.description,
      status: template.defaultStatus,
      priority: template.defaultPriority,
      startDate,
      endDate,
      members: members || [],
      estimatedBudget: template.estimatedBudget,
      milestones,
      templateId: template._id,
      createdBy: req.user._id,
      activities: [{ action: `Project created from template "${template.name}"`, user: req.user._id }],
    });

    for (const taskTemplate of template.defaultTasks || []) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + taskTemplate.daysOffset);
      await Task.create({
        title: taskTemplate.title,
        description: taskTemplate.description,
        priority: taskTemplate.priority,
        dueDate,
        status: 'Todo',
        project: project._id,
        createdBy: req.user._id,
      });
    }

    await project.populate('members', 'name avatar email role');
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Clone project
// @route   POST /api/projects/:id/clone
// @access  Private/Admin/ProjectManager
const cloneProject = async (req, res, next) => {
  try {
    const source = await Project.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title } = req.body;
    const cloneTitle = title || `${source.title} (Copy)`;

    const cloned = await Project.create({
      title: cloneTitle,
      description: source.description,
      status: 'Planning',
      priority: source.priority,
      startDate: source.startDate,
      endDate: source.endDate,
      members: source.members,
      estimatedBudget: source.estimatedBudget,
      milestones: (source.milestones || []).map((m) => ({
        title: m.title,
        dueDate: m.dueDate,
        completed: false,
      })),
      createdBy: req.user._id,
      activities: [{ action: `Cloned from project "${source.title}"`, user: req.user._id }],
    });

    const sourceTasks = await Task.find({ project: source._id });
    for (const task of sourceTasks) {
      await Task.create({
        title: task.title,
        description: task.description,
        status: 'Todo',
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo,
        project: cloned._id,
        createdBy: req.user._id,
      });
    }

    await cloned.populate('members', 'name avatar email role');
    res.status(201).json({ success: true, project: cloned });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive project
// @route   PUT /api/projects/:id/archive
// @access  Private/Admin/ProjectManager
const archiveProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.isArchived = true;
    project.archivedAt = new Date();
    project.activities.push({ action: 'Project archived', user: req.user._id });
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Unarchive project
// @route   PUT /api/projects/:id/unarchive
// @access  Private/Admin/ProjectManager
const unarchiveProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.isArchived = false;
    project.archivedAt = null;
    project.activities.push({ action: 'Project restored from archive', user: req.user._id });
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin/ProjectManager
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (req.user.role === 'ProjectManager') {
      const isMember = project.members.some(m => m.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
      }
    }

    const {
      title, description, status, priority, startDate, endDate, members,
      estimatedBudget, milestones,
    } = req.body;

    if (status && status !== project.status) {
      project.activities.push({
        action: `Status changed from ${project.status} to ${status}`,
        user: req.user._id,
      });
    }

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (estimatedBudget !== undefined) project.estimatedBudget = estimatedBudget;
    if (milestones) project.milestones = milestones;
    if (members) {
      const oldMembers = project.members || [];
      const newMembers = members;
      const addedMembers = newMembers.filter(m => !oldMembers.includes(m));
      const removedMembers = oldMembers.filter(m => !newMembers.includes(m));

      project.members = members;
      project.activities.push({ action: 'Team members updated', user: req.user._id });

      // Create notifications for newly added members
      for (const memberId of addedMembers) {
        if (String(memberId) !== String(req.user._id)) {
          try {
            await createNotification(
              memberId,
              'project_invited',
              'Added to Project',
              `You have been added to project "${project.title}"`,
              project._id,
              'Project',
              `/projects/${project._id}`,
              { projectName: project.title, addedBy: req.user.name }
            );
          } catch (notifError) {
            console.error('Failed to create notification:', notifError);
          }
        }
      }
    }

    await project.save();
    await project.populate('members', 'name avatar email role');

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Add milestone
// @route   POST /api/projects/:id/milestones
// @access  Private/Admin/ProjectManager
const addMilestone = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, dueDate } = req.body;
    project.milestones.push({ title, dueDate, completed: false });
    project.activities.push({ action: `Milestone "${title}" added`, user: req.user._id });
    await project.save();

    res.status(201).json({ success: true, milestones: project.milestones });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle milestone completion
// @route   PUT /api/projects/:id/milestones/:milestoneId
// @access  Private/Admin/ProjectManager
const updateMilestone = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const { title, dueDate, completed } = req.body;
    if (title) milestone.title = title;
    if (dueDate) milestone.dueDate = dueDate;
    if (completed !== undefined) {
      milestone.completed = completed;
      milestone.completedAt = completed ? new Date() : null;
      project.activities.push({
        action: completed ? `Milestone "${milestone.title}" completed` : `Milestone "${milestone.title}" reopened`,
        user: req.user._id,
      });
    }

    await project.save();
    res.json({ success: true, milestones: project.milestones });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete milestone
// @route   DELETE /api/projects/:id/milestones/:milestoneId
// @access  Private/Admin/ProjectManager
const deleteMilestone = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    project.milestones.pull(req.params.milestoneId);
    await project.save();
    res.json({ success: true, milestones: project.milestones });
  } catch (error) {
    next(error);
  }
};

// @desc    Add cost entry
// @route   POST /api/projects/:id/costs
// @access  Private/Admin/ProjectManager
const addCostEntry = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { description, amount, category, date } = req.body;
    project.costEntries.push({
      description,
      amount,
      category: category || 'General',
      date: date || new Date(),
      createdBy: req.user._id,
    });
    project.actualCost = (project.actualCost || 0) + amount;
    project.activities.push({
      action: `Cost entry added: $${amount} - ${description}`,
      user: req.user._id,
    });
    await project.save();

    res.status(201).json({
      success: true,
      actualCost: project.actualCost,
      costEntries: project.costEntries,
      budgetVariance: project.estimatedBudget - project.actualCost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload attachment to project
// @route   POST /api/projects/:id/attachments
// @access  Private
const addAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    };

    project.attachments.push(attachment);
    project.activities.push({
      action: `File "${req.file.originalname}" attached`,
      user: req.user._id,
    });
    await project.save();

    res.status(201).json({ success: true, attachment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attachment from project
// @route   DELETE /api/projects/:id/attachments/:attachmentId
// @access  Private
const deleteAttachment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const attachmentIndex = project.attachments.findIndex(
      (a) => a._id.toString() === req.params.attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    const attachment = project.attachments[attachmentIndex];
    if (
      attachment.uploadedBy?.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin' &&
      req.user.role !== 'ProjectManager'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this attachment' });
    }

    project.attachments.splice(attachmentIndex, 1);
    project.activities.push({ action: 'Attachment deleted', user: req.user._id });
    await project.save();

    res.json({ success: true, message: 'Attachment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ success: true, message: 'Project and its tasks deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload project avatar
// @route   POST /api/projects/:id/avatar
// @access  Private/Admin/ProjectManager
const uploadProjectAvatar = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Delete old avatar if exists
    if (project.avatar) {
      const oldAvatarPath = path.join(__dirname, '../../public', project.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Set new avatar path
    project.avatar = `/uploads/avatars/${req.file.filename}`;
    await project.save();

    res.json({
      success: true,
      project: {
        ...project.toObject(),
        avatar: project.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamMembers,
  getProjects,
  getProject,
  createProject,
  createFromTemplate,
  cloneProject,
  archiveProject,
  unarchiveProject,
  updateProject,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addCostEntry,
  addAttachment,
  deleteAttachment,
  deleteProject,
  uploadProjectAvatar,
};
