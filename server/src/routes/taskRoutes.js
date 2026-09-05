const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', authorize('SuperAdmin', 'Admin', 'ProjectManager'), createTask);
router.put('/:id', updateTask);
router.delete('/:id', authorize('SuperAdmin', 'Admin', 'ProjectManager'), deleteTask);

// Comments
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

// Attachments
router.post('/:id/attachments', upload.single('file'), addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

// Subtasks
router.post('/:id/subtasks', addSubtask);
router.put('/:id/subtasks/:subtaskId', toggleSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

// Dependencies
router.post('/:id/dependencies', addDependency);
router.delete('/:id/dependencies/:dependencyId', removeDependency);

// Time Tracking
router.post('/:id/time/start', startTimeTracking);
router.post('/:id/time/stop', stopTimeTracking);

// Tags
router.put('/:id/tags', updateTags);

// Watchers
router.post('/:id/watchers', addWatcher);
router.delete('/:id/watchers/:userId', removeWatcher);

// Checklists
router.post('/:id/checklists', addChecklist);
router.put('/:id/checklists/:checklistId/items/:itemId', toggleChecklistItem);
router.delete('/:id/checklists/:checklistId', deleteChecklist);

module.exports = router;
