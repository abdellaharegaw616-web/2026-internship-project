const mongoose = require('mongoose');

const dashboardLayoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  widgets: [{
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['stats', 'tasks', 'projects', 'team', 'activity', 'chart', 'custom'],
      required: true,
    },
    title: { type: String, required: true },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      w: { type: Number, default: 3 },
      h: { type: Number, default: 2 },
    },
    config: { type: mongoose.Schema.Types.Mixed },
    isVisible: { type: Boolean, default: true },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('DashboardLayout', dashboardLayoutSchema);
