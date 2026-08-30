const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewPeriod: {
    type: String,
    required: true,
    enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'],
  },
  periodStart: {
    type: Date,
    required: true,
  },
  periodEnd: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  scheduledDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  categories: {
    productivity: {
      type: Number,
      min: 1,
      max: 5,
    },
    quality: {
      type: Number,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
    teamwork: {
      type: Number,
      min: 1,
      max: 5,
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  strengths: [{
    type: String,
  }],
  areasForImprovement: [{
    type: String,
  }],
  goals: [{
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  }],
  comments: {
    type: String,
    trim: true,
  },
  employeeComments: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
performanceReviewSchema.index({ user: 1, createdAt: -1 });
performanceReviewSchema.index({ reviewer: 1, createdAt: -1 });
performanceReviewSchema.index({ status: 1 });
performanceReviewSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
