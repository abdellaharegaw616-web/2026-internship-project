const express = require('express');
const router = express.Router();
const {
  getPerformanceReviews,
  getPerformanceReview,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  getPerformanceReviewStats,
} = require('../controllers/performanceReviewController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(protect, getPerformanceReviews)
  .post(protect, authorize('SuperAdmin', 'Admin', 'ProjectManager'), createPerformanceReview);

router.get('/stats', protect, getPerformanceReviewStats);

router.route('/:id')
  .get(protect, getPerformanceReview)
  .put(protect, updatePerformanceReview)
  .delete(protect, authorize('SuperAdmin', 'Admin', 'ProjectManager'), deletePerformanceReview);

module.exports = router;
