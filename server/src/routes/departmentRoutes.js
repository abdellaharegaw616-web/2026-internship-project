const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(protect, getDepartments)
  .post(protect, authorize('SuperAdmin', 'Admin'), createDepartment);

router.route('/:id')
  .get(protect, getDepartment)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateDepartment)
  .delete(protect, authorize('SuperAdmin', 'Admin'), deleteDepartment);

module.exports = router;
