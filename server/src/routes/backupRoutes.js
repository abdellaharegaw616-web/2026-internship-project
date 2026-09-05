const express = require('express');
const router = express.Router();
const {
  createBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  downloadBackup,
} = require('../controllers/backupController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('SuperAdmin', 'Admin'));

router.post('/create', createBackup);
router.get('/list', listBackups);
router.post('/restore', restoreBackup);
router.delete('/:fileName', deleteBackup);
router.get('/download/:fileName', downloadBackup);

module.exports = router;
