const express = require('express');
const {
  inviteUser,
  getInvitations,
  revokeInvitation,
  deleteInvitation,
  verifyInvitation,
  acceptInvitation
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes for accepting invitations
router.get('/verify/:token', verifyInvitation);
router.post('/accept/:token', acceptInvitation);

// Protected routes
router.use(protect);
router.use(authorize('SuperAdmin', 'Admin', 'ProjectManager'));

router.route('/')
  .post(inviteUser)
  .get(getInvitations);

router.put('/:id/revoke', revokeInvitation);
router.delete('/:id', deleteInvitation);

module.exports = router;
