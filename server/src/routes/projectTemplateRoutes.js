const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getTemplate,
  createTemplate,
  deleteTemplate,
} = require('../controllers/projectTemplateController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', getTemplates);
router.get('/:id', getTemplate);
router.post('/', authorize('SuperAdmin', 'Admin', 'ProjectManager'), createTemplate);
router.delete('/:id', authorize('SuperAdmin', 'Admin'), deleteTemplate);

module.exports = router;
