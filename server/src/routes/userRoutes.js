const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  transferSuperAdmin,
  getUserPerformance,
  importUsers,
  exportUsers,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const auditAction = require('../middlewares/auditMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all users
router.get('/', getUsers);

// Transfer SuperAdmin (SuperAdmin only)
router.post('/transfer-superadmin', roleMiddleware(['SuperAdmin']), auditAction('UPDATE_ROLE', 'User'), transferSuperAdmin);

// Create a new user (Admin, SuperAdmin)
router.post('/', roleMiddleware(['Admin', 'SuperAdmin']), auditAction('CREATE', 'User'), createUser);

// Import users from CSV/Excel (Admin, SuperAdmin)
router.post('/import', roleMiddleware(['Admin', 'SuperAdmin']), importUsers);

// Export users to CSV/Excel (Admin, SuperAdmin)
router.get('/export', roleMiddleware(['Admin', 'SuperAdmin']), exportUsers);

// Get user by ID
router.get('/:id', getUserById);

// Get user performance stats
router.get('/:id/performance', getUserPerformance);

// Update user (Admin, SuperAdmin)
router.put('/:id', roleMiddleware(['Admin', 'SuperAdmin']), auditAction('UPDATE', 'User'), updateUser);

// Delete user (Admin, SuperAdmin)
router.delete('/:id', roleMiddleware(['Admin', 'SuperAdmin']), auditAction('DELETE', 'User'), deleteUser);

module.exports = router;
