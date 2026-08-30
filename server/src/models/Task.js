const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const checklistItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const timeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'],
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    subtasks: [subtaskSchema],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    dependentTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Weekly' },
      interval: { type: Number, default: 1 },
      endDate: { type: Date },
    },
    timeEntries: [timeEntrySchema],
    totalTime: { type: Number, default: 0 }, // in seconds
    tags: [{ type: String }],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    checklists: [{
      title: { type: String, required: true },
      items: [checklistItemSchema],
      createdAt: { type: Date, default: Date.now },
    }],
    attachments: [attachmentSchema],
    comments: [commentSchema],
    activities: [activityLogSchema],
  },
  { timestamps: true }
);

// Index for faster queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ parentTask: 1 });
taskSchema.index({ tags: 1 });

// Virtual for subtask completion percentage
taskSchema.virtual('subtaskProgress').get(function() {
  if (this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter(st => st.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Virtual for checklist completion percentage
taskSchema.virtual('checklistProgress').get(function() {
  if (this.checklists.length === 0) return 0;
  let totalItems = 0;
  let completedItems = 0;
  this.checklists.forEach(cl => {
    totalItems += cl.items.length;
    completedItems += cl.items.filter(item => item.completed).length;
  });
  return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
});

module.exports = mongoose.model('Task', taskSchema);
