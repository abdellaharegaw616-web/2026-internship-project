const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const ActivityLog = require('../models/ActivityLog');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone, funFact, superpower, themePreference } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Force role to TeamMember for public registration
    const userRole = 'TeamMember';

    // Set default permissions based on role
    let userPermissions = [];
    if (userRole === 'Admin') {
      userPermissions = [
        'inviteUsers',
        'manageUsers',
        'manageProjects',
        'manageTasks',
        'assignTeamMembers',
        'viewAuditLogs',
        'sendNotifications',
        'deleteProjects',
        'deleteTasks',
        'deleteUsers'
      ];
    } else if (userRole === 'ProjectManager') {
      userPermissions = [
        'manageProjects',
        'manageTasks',
        'assignTeamMembers',
        'sendNotifications'
      ];
    } else {
      userPermissions = ['manageTasks'];
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: userRole, 
      department, 
      phone, 
      funFact, 
      superpower, 
      themePreference,
      permissions: userPermissions
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
        funFact: user.funFact,
        superpower: user.superpower,
        themePreference: user.themePreference,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated' });
    }

    const token = generateToken(user._id);

    // Create session
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Parse user agent for device/browser info
    const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    await Session.create({
      user: user._id,
      token,
      device,
      browser,
      os,
      ipAddress,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Log login activity
    await ActivityLog.create({
      user: user._id,
      action: 'login',
      ipAddress,
      device,
      browser,
      os,
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
        funFact: user.funFact,
        superpower: user.superpower,
        themePreference: user.themePreference,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, department, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department, phone, avatar },
      { new: true, runValidators: true }
    );

    // Log profile update activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'profile_update',
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { fields: Object.keys(req.body) },
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    // Log profile update activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'profile_update',
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { fields: ['avatar'] },
    });

    res.json({ success: true, user, avatarUrl });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    // Log password change activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'password_change',
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error)
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested a password reset for your account.
      
      Please click on the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 10 minutes.
      
      If you did not request this, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token from URL
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate 2FA OTP
// @route   POST /api/auth/2fa/generate
// @access  Private
const generate2FAOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorOTP = otp;
    user.twoFactorOTPExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    // Send OTP via email
    const message = `
      Your Two-Factor Authentication OTP is: ${otp}
      
      This OTP will expire in 5 minutes.
      
      If you did not request this, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Two-Factor Authentication OTP',
      message,
    });

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA OTP and enable 2FA
// @route   POST /api/auth/2fa/verify
// @access  Private
const verify2FAOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.twoFactorOTP || user.twoFactorOTPExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (user.twoFactorOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.twoFactorOTP = undefined;
    user.twoFactorOTPExpires = undefined;
    await user.save();

    // Log 2FA enabled activity
    await ActivityLog.create({
      user: req.user._id,
      action: '2fa_enabled',
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({ success: true, message: 'Two-Factor Authentication enabled successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
const disable2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    // Log 2FA disabled activity
    await ActivityLog.create({
      user: req.user._id,
      action: '2fa_disabled',
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.json({ success: true, message: 'Two-Factor Authentication disabled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active sessions
// @route   GET /api/auth/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() },
    }).sort({ lastActivity: -1 });

    // Get current session token from authorization header
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    
    const sessionsWithInfo = sessions.map(session => ({
      _id: session._id,
      device: session.device,
      browser: session.browser,
      os: session.os,
      ipAddress: session.ipAddress,
      lastActivity: session.lastActivity,
      isCurrent: session.token === currentToken,
      createdAt: session.createdAt,
    }));

    res.json({ success: true, sessions: sessionsWithInfo });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke session
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.isActive = false;
    await session.save();

    // Log session revoked activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'session_revoked',
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { sessionId },
    });

    res.json({ success: true, message: 'Session revoked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke all sessions except current
// @route   POST /api/auth/sessions/revoke-all
// @access  Private
const revokeAllSessions = async (req, res, next) => {
  try {
    const currentToken = req.headers.authorization?.replace('Bearer ', '');

    await Session.updateMany(
      {
        user: req.user._id,
        token: { $ne: currentToken },
        isActive: true,
      },
      { isActive: false }
    );

    res.json({ success: true, message: 'All other sessions revoked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity logs
// @route   GET /api/auth/activity-logs
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ user: req.user._id });

    res.json({ success: true, logs, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete current user account permanently
// @route   DELETE /api/auth/delete-account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Prevent SuperAdmin from deleting their own account
    if (user.role === 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'SuperAdmin cannot delete their account. Transfer the role first.' });
    }

    // Revoke all sessions
    await Session.updateMany({ user: req.user._id }, { isActive: false });

    // Delete user
    await User.findByIdAndDelete(req.user._id);

    // Log account deletion
    await ActivityLog.create({
      user: req.user._id,
      action: 'account_deleted',
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { email: user.email },
    });

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword, generate2FAOTP, verify2FAOTP, disable2FA, getSessions, revokeSession, revokeAllSessions, getActivityLogs, uploadAvatar, deleteAccount };
