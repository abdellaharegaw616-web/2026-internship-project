const express = require('express');
const router = express.Router();
const {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  deleteLeave,
  getLeaveStats,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(protect, getLeaves)
  .post(protect, createLeave);

router.get('/stats', protect, getLeaveStats);

router.route('/:id')
  .get(protect, getLeave)
  .put(protect, updateLeave)
  .delete(protect, deleteLeave);

router.put('/:id/approve', protect, authorize('SuperAdmin', 'Admin', 'ProjectManager'), approveLeave);
router.put('/:id/reject', protect, authorize('SuperAdmin', 'Admin', 'ProjectManager'), rejectLeave);
router.put('/:id/cancel', protect, cancelLeave);

module.exports = router;
