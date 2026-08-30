const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Get all leaves (with filtering)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res, next) => {
  try {
    const { status, userId, startDate, endDate } = req.query;
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';

    let query = {};
    
    // Non-admin users can only see their own leaves
    if (!isAdmin) {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
const getLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && leave.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, leave });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new leave request
// @route   POST /api/leaves
// @access  Private
const createLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason, attachments } = req.body;

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid date range' });
    }

    const leave = await Leave.create({
      user: req.user._id,
      type,
      startDate,
      endDate,
      days,
      reason,
      attachments: attachments || [],
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    res.status(201).json({ success: true, leave: populatedLeave });
  } catch (error) {
    next(error);
  }
};

// @desc    Update leave request
// @route   PUT /api/leaves/:id
// @access  Private
const updateLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Can only update pending leaves
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Can only update pending leave requests' });
    }

    const { type, startDate, endDate, reason, attachments } = req.body;

    // Recalculate days if dates changed
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      leave.days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      leave.startDate = startDate;
      leave.endDate = endDate;
    }

    leave.type = type || leave.type;
    leave.reason = reason !== undefined ? reason : leave.reason;
    leave.attachments = attachments || leave.attachments;

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    res.json({ success: true, leave: populatedLeave });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve leave request
// @route   PUT /api/leaves/:id/approve
// @access  Private (Admin/Manager only)
const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Leave is not pending' });
    }

    leave.status = 'Approved';
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    res.json({ success: true, leave: populatedLeave });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject leave request
// @route   PUT /api/leaves/:id/reject
// @access  Private (Admin/Manager only)
const rejectLeave = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Leave is not pending' });
    }

    leave.status = 'Rejected';
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    leave.rejectionReason = rejectionReason;
    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    res.json({ success: true, leave: populatedLeave });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel leave request
// @route   PUT /api/leaves/:id/cancel
// @access  Private
const cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Can only cancel pending or approved leaves
    if (leave.status !== 'Pending' && leave.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this leave' });
    }

    leave.status = 'Cancelled';
    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('user', 'name email avatar department')
      .populate('approvedBy', 'name email');

    res.json({ success: true, leave: populatedLeave });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Can only delete pending leaves
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Can only delete pending leave requests' });
    }

    await leave.deleteOne();

    res.json({ success: true, message: 'Leave deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave statistics
// @route   GET /api/leaves/stats
// @access  Private
const getLeaveStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    let query = isAdmin ? {} : { user: req.user._id };

    const stats = {
      total: await Leave.countDocuments(query),
      pending: await Leave.countDocuments({ ...query, status: 'Pending' }),
      approved: await Leave.countDocuments({ ...query, status: 'Approved' }),
      rejected: await Leave.countDocuments({ ...query, status: 'Rejected' }),
      cancelled: await Leave.countDocuments({ ...query, status: 'Cancelled' }),
    };

    // Calculate total days taken this year
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const approvedLeaves = await Leave.find({
      ...query,
      status: 'Approved',
      startDate: { $gte: yearStart, $lte: yearEnd },
    });

    stats.totalDaysTaken = approvedLeaves.reduce((sum, leave) => sum + leave.days, 0);

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  deleteLeave,
  getLeaveStats,
};
