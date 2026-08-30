const PerformanceReview = require('../models/PerformanceReview');
const User = require('../models/User');

// @desc    Get all performance reviews (with filtering)
// @route   GET /api/performance-reviews
// @access  Private
const getPerformanceReviews = async (req, res, next) => {
  try {
    const { userId, status, reviewPeriod } = req.query;
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';

    let query = {};
    
    // Non-admin users can only see their own reviews
    if (!isAdmin) {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    if (reviewPeriod) {
      query.reviewPeriod = reviewPeriod;
    }

    const reviews = await PerformanceReview.find(query)
      .populate('user', 'name email avatar department')
      .populate('reviewer', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single performance review
// @route   GET /api/performance-reviews/:id
// @access  Private
const getPerformanceReview = async (req, res, next) => {
  try {
    const review = await PerformanceReview.findById(req.params.id)
      .populate('user', 'name email avatar department')
      .populate('reviewer', 'name email avatar');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Performance review not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    if (!isAdmin && review.user._id.toString() !== req.user._id.toString() && review.reviewer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new performance review
// @route   POST /api/performance-reviews
// @access  Private (Admin/Manager only)
const createPerformanceReview = async (req, res, next) => {
  try {
    const {
      user,
      reviewer,
      reviewPeriod,
      periodStart,
      periodEnd,
      scheduledDate,
    } = req.body;

    // Validate user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Validate reviewer exists
    const reviewerExists = await User.findById(reviewer);
    if (!reviewerExists) {
      return res.status(400).json({ success: false, message: 'Reviewer not found' });
    }

    const review = await PerformanceReview.create({
      user,
      reviewer,
      reviewPeriod,
      periodStart,
      periodEnd,
      scheduledDate,
      status: 'Scheduled',
    });

    const populatedReview = await PerformanceReview.findById(review._id)
      .populate('user', 'name email avatar department')
      .populate('reviewer', 'name email avatar');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Update performance review
// @route   PUT /api/performance-reviews/:id
// @access  Private
const updatePerformanceReview = async (req, res, next) => {
  try {
    const review = await PerformanceReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Performance review not found' });
    }

    // Check if user has permission
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    const isReviewer = review.reviewer.toString() === req.user._id.toString();
    const isUser = review.user.toString() === req.user._id.toString();

    if (!isAdmin && !isReviewer && !isUser) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const {
      status,
      scheduledDate,
      completedDate,
      overallRating,
      categories,
      strengths,
      areasForImprovement,
      goals,
      comments,
      employeeComments,
    } = req.body;

    // Only reviewer can update ratings and comments
    if (isReviewer || isAdmin) {
      if (status !== undefined) review.status = status;
      if (scheduledDate !== undefined) review.scheduledDate = scheduledDate;
      if (completedDate !== undefined) review.completedDate = completedDate;
      if (overallRating !== undefined) review.overallRating = overallRating;
      if (categories !== undefined) review.categories = categories;
      if (strengths !== undefined) review.strengths = strengths;
      if (areasForImprovement !== undefined) review.areasForImprovement = areasForImprovement;
      if (goals !== undefined) review.goals = goals;
      if (comments !== undefined) review.comments = comments;
    }

    // Only user can update employee comments
    if (isUser && employeeComments !== undefined) {
      review.employeeComments = employeeComments;
    }

    await review.save();

    const populatedReview = await PerformanceReview.findById(review._id)
      .populate('user', 'name email avatar department')
      .populate('reviewer', 'name email avatar');

    res.json({ success: true, review: populatedReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete performance review
// @route   DELETE /api/performance-reviews/:id
// @access  Private (Admin/Manager only)
const deletePerformanceReview = async (req, res, next) => {
  try {
    const review = await PerformanceReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Performance review not found' });
    }

    // Can only delete scheduled reviews
    if (review.status !== 'Scheduled') {
      return res.status(400).json({ success: false, message: 'Can only delete scheduled reviews' });
    }

    await review.deleteOne();

    res.json({ success: true, message: 'Performance review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance review statistics
// @route   GET /api/performance-reviews/stats
// @access  Private
const getPerformanceReviewStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'ProjectManager';
    let query = isAdmin ? {} : { user: req.user._id };

    const stats = {
      total: await PerformanceReview.countDocuments(query),
      scheduled: await PerformanceReview.countDocuments({ ...query, status: 'Scheduled' }),
      inProgress: await PerformanceReview.countDocuments({ ...query, status: 'In Progress' }),
      completed: await PerformanceReview.countDocuments({ ...query, status: 'Completed' }),
    };

    // Calculate average rating for completed reviews
    const completedReviews = await PerformanceReview.find({ ...query, status: 'Completed', overallRating: { $ne: null } });
    const totalRating = completedReviews.reduce((sum, review) => sum + review.overallRating, 0);
    stats.averageRating = completedReviews.length > 0 ? (totalRating / completedReviews.length).toFixed(1) : 0;

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerformanceReviews,
  getPerformanceReview,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  getPerformanceReviewStats,
};
