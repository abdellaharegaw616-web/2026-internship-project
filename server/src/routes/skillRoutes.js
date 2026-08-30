const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getExpiringCertifications,
  getSkillStats,
} = require('../controllers/skillController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, getSkills)
  .post(protect, createSkill);

router.get('/expiring', protect, getExpiringCertifications);
router.get('/stats', protect, getSkillStats);

router.route('/:id')
  .get(protect, getSkill)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
