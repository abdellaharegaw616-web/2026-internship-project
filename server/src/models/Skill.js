const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Soft Skills', 'Language', 'Certification', 'Other'],
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  isCertification: {
    type: Boolean,
    default: false,
  },
  issuer: {
    type: String,
    trim: true,
  },
  issueDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  credentialId: {
    type: String,
    trim: true,
  },
  credentialUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
skillSchema.index({ user: 1, category: 1 });
skillSchema.index({ expiryDate: 1 });

// Virtual for checking if certification is expiring soon
skillSchema.virtual('isExpiringSoon').get(function() {
  if (!this.isCertification || !this.expiryDate) return false;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
});

// Virtual for checking if certification is expired
skillSchema.virtual('isExpired').get(function() {
  if (!this.isCertification || !this.expiryDate) return false;
  return new Date(this.expiryDate) < new Date();
});

module.exports = mongoose.model('Skill', skillSchema);
