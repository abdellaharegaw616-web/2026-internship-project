const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs (with filtering)
// @route   GET /api/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res, next) => {
  try {
    const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (userId) query.user = userId;
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const logs = await AuditLog.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({ 
      success: true, 
      logs, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single audit log
// @route   GET /api/audit-logs/:id
// @access  Private (Admin only)
const getAuditLog = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('user', 'name email avatar');

    if (!log) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    res.json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// @desc    Create audit log (helper function)
const createAuditLog = async (userId, action, entityType, entityId = null, entityName = null, changes = null, ipAddress = null, userAgent = null, metadata = null) => {
  try {
    const log = await AuditLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      entityName,
      changes,
      ipAddress,
      userAgent,
      metadata,
    });
    return log;
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// @desc    Get audit log statistics
// @route   GET /api/audit-logs/stats
// @access  Private (Admin only)
const getAuditLogStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const stats = {
      total: await AuditLog.countDocuments(dateFilter),
      byAction: await AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      byEntityType: await AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$entityType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      byUser: await AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { _id: 1, count: 1, userName: '$user.name' } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    };

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Export audit logs
// @route   GET /api/audit-logs/export
// @access  Private (Admin only)
const exportAuditLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(1000);

    if (format === 'json') {
      res.json({ success: true, logs });
    } else if (format === 'csv') {
      const { Parser } = require('json2csv');
      const fields = ['_id', 'action', 'entityType', 'entityId', 'entityName', 'user.name', 'user.email', 'ipAddress', 'createdAt'];
      const parser = new Parser({ fields });
      const csv = parser.parse(logs.map(log => ({
        ...log.toObject(),
        'user.name': log.user?.name,
        'user.email': log.user?.email,
      })));
      
      res.header('Content-Type', 'text/csv');
      res.attachment('audit-logs.csv');
      res.send(csv);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditLog,
  createAuditLog,
  getAuditLogStats,
  exportAuditLogs,
};
