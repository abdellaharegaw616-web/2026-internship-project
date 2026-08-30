const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPerformance,
  importUsers,
  exportUsers,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all users (All authenticated users can view, but with different data access)
router.get('/', getUsers);

// Create a new user (Admin only)
router.post('/', roleMiddleware(['Admin']), createUser);

// Import users from CSV/Excel (Admin only)
router.post('/import', roleMiddleware(['Admin']), importUsers);

// Export users to CSV/Excel (Admin only) - Must come before /:id
router.get('/export', roleMiddleware(['Admin']), exportUsers);

// Get user by ID
router.get('/:id', getUserById);

// Get user performance stats
router.get('/:id/performance', getUserPerformance);

// Update user (Admin only)
router.put('/:id', roleMiddleware(['Admin']), updateUser);

// Delete user (Admin only)
router.delete('/:id', roleMiddleware(['Admin']), deleteUser);

module.exports = router;
