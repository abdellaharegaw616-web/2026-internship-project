const express = require('express');
const router = express.Router();
const {
  getAuditLogs,
  getAuditLog,
  getAuditLogStats,
  exportAuditLogs,
} = require('../controllers/auditLogController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('Admin'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditLogStats);
router.get('/export', exportAuditLogs);
router.get('/:id', getAuditLog);

module.exports = router;
