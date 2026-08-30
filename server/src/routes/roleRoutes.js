const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  initializeDefaultRoles,
} = require('../controllers/roleController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('Admin'));

router.get('/', getRoles);
router.post('/initialize', initializeDefaultRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
