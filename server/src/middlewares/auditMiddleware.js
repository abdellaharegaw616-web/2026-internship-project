const AuditLog = require('../models/AuditLog');

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
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent']
        }).catch(err => console.error('AuditLog Error:', err));
      }
      originalSend.call(this, data);
    };
    next();
  };
};

module.exports = auditAction;
