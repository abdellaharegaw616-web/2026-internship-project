const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword, generate2FAOTP, verify2FAOTP, disable2FA, getSessions, revokeSession, revokeAllSessions, getActivityLogs, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/2fa/generate', protect, generate2FAOTP);
router.post('/2fa/verify', protect, verify2FAOTP);
router.post('/2fa/disable', protect, disable2FA);
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);
router.post('/sessions/revoke-all', protect, revokeAllSessions);
router.get('/activity-logs', protect, getActivityLogs);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
