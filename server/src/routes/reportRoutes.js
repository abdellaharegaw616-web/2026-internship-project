const express = require('express');
const router = express.Router();
const {
  exportProjectReport,
  exportTaskReport,
  exportTeamReport,
  exportProjectsSummary,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/projects/:projectId', exportProjectReport);
router.get('/tasks', exportTaskReport);
router.get('/team', authorize('SuperAdmin', 'Admin', 'ProjectManager'), exportTeamReport);
router.get('/projects-summary', authorize('SuperAdmin', 'Admin', 'ProjectManager'), exportProjectsSummary);

module.exports = router;
