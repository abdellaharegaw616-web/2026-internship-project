const express = require('express');
const router = express.Router();
const { getDashboardStats, getTeamUtilization, getPublicStats } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

router.get('/public-stats', getPublicStats);
router.get('/', protect, getDashboardStats);
router.get('/team-utilization', protect, getTeamUtilization);

module.exports = router;
