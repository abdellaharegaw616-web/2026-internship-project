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
router.post('/', authorize('Admin', 'ProjectManager'), createProject);
router.post('/from-template/:templateId', authorize('Admin', 'ProjectManager'), createFromTemplate);

router.get('/:id', getProject);
router.put('/:id', authorize('Admin', 'ProjectManager'), updateProject);
router.delete('/:id', authorize('Admin'), deleteProject);
router.post('/:id/avatar', authorize('Admin', 'ProjectManager'), upload.single('avatar'), uploadProjectAvatar);

router.post('/:id/clone', authorize('Admin', 'ProjectManager'), cloneProject);
router.put('/:id/archive', authorize('Admin', 'ProjectManager'), archiveProject);
router.put('/:id/unarchive', authorize('Admin', 'ProjectManager'), unarchiveProject);

router.post('/:id/milestones', authorize('Admin', 'ProjectManager'), addMilestone);
router.put('/:id/milestones/:milestoneId', authorize('Admin', 'ProjectManager'), updateMilestone);
router.delete('/:id/milestones/:milestoneId', authorize('Admin', 'ProjectManager'), deleteMilestone);

router.post('/:id/costs', authorize('Admin', 'ProjectManager'), addCostEntry);
router.post('/:id/attachments', upload.single('file'), addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;
