const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'ProjectManager', 'TeamMember'],
      required: true,
      default: 'TeamMember',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      description: 'Optional: Automatically assign to this project upon registration',
    },
    tokenHash: {
      type: String,
      required: true,
      select: false, // Don't return this by default
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Expired', 'Revoked'],
      default: 'Pending',
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to automatically remove expired invitations if needed, 
// but we want to keep them as 'Expired' for audit purposes so we don't use TTL index.
invitationSchema.index({ email: 1, status: 1 });
invitationSchema.index({ tokenHash: 1 });

module.exports = mongoose.model('Invitation', invitationSchema);
