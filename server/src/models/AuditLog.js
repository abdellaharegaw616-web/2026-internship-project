const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
      'ASSIGN_TASK', 'COMPLETE_TASK', 'ADD_COMMENT', 'UPLOAD_FILE',
      'CREATE_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
      'ADD_MEMBER', 'REMOVE_MEMBER', 'UPDATE_ROLE',
      'APPROVE_LEAVE', 'REJECT_LEAVE', 'CANCEL_LEAVE',
      'CREATE_DEPARTMENT', 'UPDATE_DEPARTMENT', 'DELETE_DEPARTMENT',
      'ADD_SKILL', 'UPDATE_SKILL', 'DELETE_SKILL',
      'CREATE_REVIEW', 'UPDATE_REVIEW', 'DELETE_REVIEW',
      'EXPORT_DATA', 'IMPORT_DATA',
    ],
  },
  entityType: {
    type: String,
    required: true,
    enum: ['User', 'Task', 'Project', 'Comment', 'File', 'Department', 'Leave', 'Skill', 'PerformanceReview', 'System'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  entityName: {
    type: String,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Index for faster queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
