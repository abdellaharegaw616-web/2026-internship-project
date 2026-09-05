const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

const { hasPermission } = require('../utils/permissions');
const AuditLog = require('../models/AuditLog');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to perform this action`,
      });
    }
    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: `You do not have the required permission: ${permission}`,
      });
    }
    next();
  };
};

const auditAction = (action, entityType) => {
  return async (req, res, next) => {
    // Intercept the response to log after it completes successfully
    const originalSend = res.send;
    res.send = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Log action asynchronously
        let entityId = req.params.id || null;
        let changes = req.body || null;
        // Strip sensitive info from changes
        if (changes?.password) {
           changes = { ...changes, password: '[REDACTED]' };
        }

        AuditLog.create({
          user: req.user._id,
          action: action,
          entityType: entityType,
          entityId: entityId,
          changes: changes,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent']
        }).catch(err => console.error('AuditLog Error:', err));
      }
      originalSend.call(this, data);
    };
    next();
  };
};

module.exports = { protect, authorize, requirePermission, auditAction };
