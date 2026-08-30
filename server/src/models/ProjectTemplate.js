const mongoose = require('mongoose');

const templateTaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  daysOffset: { type: Number, default: 0 },
});

const templateMilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  daysOffset: { type: Number, default: 0 },
});

const projectTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Software', 'Marketing', 'Product', 'Event', 'General'],
      default: 'General',
    },
    defaultStatus: {
      type: String,
      enum: ['Planning', 'Active', 'On Hold', 'Completed'],
      default: 'Planning',
    },
    defaultPriority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    defaultDurationDays: { type: Number, default: 30 },
    estimatedBudget: { type: Number, default: 0 },
    defaultTasks: [templateTaskSchema],
    defaultMilestones: [templateMilestoneSchema],
    isSystem: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectTemplate', projectTemplateSchema);
