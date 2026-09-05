const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
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
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/team/members', getTeamMembers);
router.get('/', getProjects);
router.post('/', authorize('SuperAdmin', 'Admin', 'ProjectManager'), createProject);
router.post('/from-template/:templateId', authorize('SuperAdmin', 'Admin', 'ProjectManager'), createFromTemplate);

router.get('/:id', getProject);
router.put('/:id', authorize('SuperAdmin', 'Admin', 'ProjectManager'), updateProject);
router.delete('/:id', authorize('SuperAdmin', 'Admin'), deleteProject);
router.post('/:id/avatar', authorize('SuperAdmin', 'Admin', 'ProjectManager'), upload.single('avatar'), uploadProjectAvatar);

router.post('/:id/clone', authorize('SuperAdmin', 'Admin', 'ProjectManager'), cloneProject);
router.put('/:id/archive', authorize('SuperAdmin', 'Admin', 'ProjectManager'), archiveProject);
router.put('/:id/unarchive', authorize('SuperAdmin', 'Admin', 'ProjectManager'), unarchiveProject);

router.post('/:id/milestones', authorize('SuperAdmin', 'Admin', 'ProjectManager'), addMilestone);
router.put('/:id/milestones/:milestoneId', authorize('SuperAdmin', 'Admin', 'ProjectManager'), updateMilestone);
router.delete('/:id/milestones/:milestoneId', authorize('SuperAdmin', 'Admin', 'ProjectManager'), deleteMilestone);

router.post('/:id/costs', authorize('SuperAdmin', 'Admin', 'ProjectManager'), addCostEntry);
router.post('/:id/attachments', upload.single('file'), addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;
