const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { sendTaskAssignedEmail, sendDueDateReminderEmail } = require('../services/emailService');
const { getIO } = require('../config/socket');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignedTo, search } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) query.title = { $regex: search, $options: 'i' };

    // TeamMembers only see their own tasks
    if (req.user.role === 'TeamMember') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatar email')
      .populate('project', 'title')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task with comments
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar email department role')
      .populate('project', 'title status')
      .populate('createdBy', 'name avatar')
      .populate('comments.user', 'name avatar role')
      .populate('activities.user', 'name avatar');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin/ProjectManager
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

    // Verify project exists
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project,
      createdBy: req.user._id,
      activities: [{ action: 'Task created', user: req.user._id }],
    });

    // Log activity on project
    projectDoc.activities.push({ action: `Task "${title}" added`, user: req.user._id });
    await projectDoc.save();

    // Send email notification if task is assigned
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (assignedUser && assignedUser.email) {
        try {
          await sendTaskAssignedEmail(
            assignedUser.email,
            title,
            projectDoc.name,
            dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date'
          );
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      }
    }

    await task.populate([
      { path: 'assignedTo', select: 'name avatar email' },
      { path: 'project', select: 'title' },
    ]);

    // Emit socket event for real-time notification
    try {
      const io = getIO();
      io.to(assignedTo).emit('task-created', {
        task,
        message: `New task assigned: ${task.title}`,
      });
    } catch (socketError) {
      console.error('Socket error:', socketError);
    }

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // TeamMembers can only update status
    if (req.user.role === 'TeamMember') {
      if (req.body.status && req.body.status !== task.status) {
        task.activities.push({
          action: `Status changed to ${req.body.status}`,
          user: req.user._id,
        });
        task.status = req.body.status;
        await task.save();
        return res.json({ success: true, task });
      }
      return res.status(403).json({ success: false, message: 'Team members can only update task status' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (status && status !== task.status) {
      task.activities.push({ action: `Status changed to ${status}`, user: req.user._id });
    }
    if (assignedTo && String(assignedTo) !== String(task.assignedTo)) {
      task.activities.push({ action: 'Assignee updated', user: req.user._id });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name avatar email' },
      { path: 'project', select: 'title' },
    ]);

    // Emit socket event for real-time notification
    try {
      const io = getIO();
      io.to(task.assignedTo?._id).emit('task-updated', {
        task,
        message: `Task updated: ${task.title}`,
      });
    } catch (socketError) {
      console.error('Socket error:', socketError);
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin/ProjectManager
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await task.deleteOne();

    // Emit socket event for real-time notification
    try {
      const io = getIO();
      io.to(task.assignedTo?._id).emit('task-deleted', {
        taskId: task._id,
        message: `Task deleted: ${task.title}`,
      });
    } catch (socketError) {
      console.error('Socket error:', socketError);
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const text = req.body.text || req.body.message;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const comment = {
      text: text.trim(),
      user: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    task.comments.push(comment);
    task.activities.push({ action: 'Comment added', user: req.user._id });
    await task.save();

    await task.populate('comments.user', 'name avatar role');
    const newComment = task.comments[task.comments.length - 1];
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from task
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const commentIndex = task.comments.findIndex(
      (c) => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only comment author or admin can delete
    const comment = task.comments[commentIndex];
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    task.comments.splice(commentIndex, 1);
    task.activities.push({ action: 'Comment deleted', user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const addAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
    };

    task.attachments.push(attachment);
    task.activities.push({ action: `File "${req.file.originalname}" attached`, user: req.user._id });
    await task.save();

    res.status(201).json({ success: true, attachment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
const deleteAttachment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const attachmentIndex = task.attachments.findIndex(
      (a) => a._id.toString() === req.params.attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    // Only uploader or admin can delete
    const attachment = task.attachments[attachmentIndex];
    if (
      attachment.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this attachment' });
    }

    task.attachments.splice(attachmentIndex, 1);
    task.activities.push({ action: 'Attachment deleted', user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Attachment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.subtasks.push({ title });
    task.activities.push({ action: `Subtask "${title}" added`, user: req.user._id });
    await task.save();

    res.status(201).json({ success: true, subtask: task.subtasks[task.subtasks.length - 1] });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const toggleSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    subtask.completedAt = subtask.completed ? new Date() : null;
    subtask.completedBy = subtask.completed ? req.user._id : null;
    
    task.activities.push({ 
      action: `Subtask "${subtask.title}" ${subtask.completed ? 'completed' : 'uncompleted'}`, 
      user: req.user._id 
    });
    await task.save();

    res.json({ success: true, subtask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const deleteSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    task.subtasks.pull(req.params.subtaskId);
    task.activities.push({ action: `Subtask "${subtask.title}" deleted`, user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Subtask deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add task dependency
// @route   POST /api/tasks/:id/dependencies
// @access  Private
const addDependency = async (req, res, next) => {
  try {
    const { dependsOnTaskId } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const dependencyTask = await Task.findById(dependsOnTaskId);
    if (!dependencyTask) {
      return res.status(404).json({ success: false, message: 'Dependency task not found' });
    }

    if (task.dependencies.includes(dependsOnTaskId)) {
      return res.status(400).json({ success: false, message: 'Dependency already exists' });
    }

    task.dependencies.push(dependsOnTaskId);
    dependencyTask.dependentTasks.push(task._id);
    
    task.activities.push({ action: `Dependency added to task "${dependencyTask.title}"`, user: req.user._id });
    await task.save();
    await dependencyTask.save();

    res.json({ success: true, message: 'Dependency added successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove task dependency
// @route   DELETE /api/tasks/:id/dependencies/:dependencyId
// @access  Private
const removeDependency = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const dependencyTask = await Task.findById(req.params.dependencyId);
    if (!dependencyTask) {
      return res.status(404).json({ success: false, message: 'Dependency task not found' });
    }

    task.dependencies.pull(req.params.dependencyId);
    dependencyTask.dependentTasks.pull(task._id);
    
    task.activities.push({ action: `Dependency removed from task "${dependencyTask.title}"`, user: req.user._id });
    await task.save();
    await dependencyTask.save();

    res.json({ success: true, message: 'Dependency removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Start time tracking
// @route   POST /api/tasks/:id/time/start
// @access  Private
const startTimeTracking = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user already has an active timer
    const activeEntry = task.timeEntries.find(te => te.user.toString() === req.user._id.toString() && !te.endTime);
    if (activeEntry) {
      return res.status(400).json({ success: false, message: 'Timer already running' });
    }

    task.timeEntries.push({
      user: req.user._id,
      startTime: new Date(),
    });
    
    task.activities.push({ action: 'Time tracking started', user: req.user._id });
    await task.save();

    res.status(201).json({ success: true, timeEntry: task.timeEntries[task.timeEntries.length - 1] });
  } catch (error) {
    next(error);
  }
};

// @desc    Stop time tracking
// @route   POST /api/tasks/:id/time/stop
// @access  Private
const stopTimeTracking = async (req, res, next) => {
  try {
    const { description } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const activeEntry = task.timeEntries.find(te => te.user.toString() === req.user._id.toString() && !te.endTime);
    if (!activeEntry) {
      return res.status(400).json({ success: false, message: 'No active timer found' });
    }

    activeEntry.endTime = new Date();
    activeEntry.duration = Math.floor((activeEntry.endTime - activeEntry.startTime) / 1000);
    activeEntry.description = description || '';
    
    // Update total time
    task.totalTime += activeEntry.duration;
    
    task.activities.push({ action: 'Time tracking stopped', user: req.user._id });
    await task.save();

    res.json({ success: true, timeEntry: activeEntry });
  } catch (error) {
    next(error);
  }
};

// @desc    Add tags to task
// @route   PUT /api/tasks/:id/tags
// @access  Private
const updateTags = async (req, res, next) => {
  try {
    const { tags } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.tags = tags || [];
    task.activities.push({ action: 'Tags updated', user: req.user._id });
    await task.save();

    res.json({ success: true, tags: task.tags });
  } catch (error) {
    next(error);
  }
};

// @desc    Add watcher to task
// @route   POST /api/tasks/:id/watchers
// @access  Private
const addWatcher = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.watchers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already watching this task' });
    }

    task.watchers.push(userId);
    task.activities.push({ action: 'Watcher added', user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Watcher added successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove watcher from task
// @route   DELETE /api/tasks/:id/watchers/:userId
// @access  Private
const removeWatcher = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.watchers.pull(req.params.userId);
    task.activities.push({ action: 'Watcher removed', user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Watcher removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add checklist to task
// @route   POST /api/tasks/:id/checklists
// @access  Private
const addChecklist = async (req, res, next) => {
  try {
    const { title, items } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.checklists.push({
      title,
      items: items || [],
    });
    
    task.activities.push({ action: `Checklist "${title}" added`, user: req.user._id });
    await task.save();

    res.status(201).json({ success: true, checklist: task.checklists[task.checklists.length - 1] });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle checklist item
// @route   PUT /api/tasks/:id/checklists/:checklistId/items/:itemId
// @access  Private
const toggleChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const checklist = task.checklists.id(req.params.checklistId);
    if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found' });
    }

    const item = checklist.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Checklist item not found' });
    }

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date() : null;
    item.completedBy = item.completed ? req.user._id : null;
    
    task.activities.push({ 
      action: `Checklist item "${item.title}" ${item.completed ? 'completed' : 'uncompleted'}`, 
      user: req.user._id 
    });
    await task.save();

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete checklist
// @route   DELETE /api/tasks/:id/checklists/:checklistId
// @access  Private
const deleteChecklist = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const checklist = task.checklists.id(req.params.checklistId);
    if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found' });
    }

    task.checklists.pull(req.params.checklistId);
    task.activities.push({ action: `Checklist "${checklist.title}" deleted`, user: req.user._id });
    await task.save();

    res.json({ success: true, message: 'Checklist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  addDependency,
  removeDependency,
  startTimeTracking,
  stopTimeTracking,
  updateTags,
  addWatcher,
  removeWatcher,
  addChecklist,
  toggleChecklistItem,
  deleteChecklist,
};
