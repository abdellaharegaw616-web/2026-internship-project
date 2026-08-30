const express = require('express');
const router = express.Router();
const {
  getDashboardLayout,
  updateDashboardLayout,
  addWidget,
  updateWidget,
  deleteWidget,
  resetDashboardLayout,
} = require('../controllers/dashboardLayoutController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getDashboardLayout);
router.put('/', updateDashboardLayout);
router.post('/widgets', addWidget);
router.put('/widgets/:widgetId', updateWidget);
router.delete('/widgets/:widgetId', deleteWidget);
router.post('/reset', resetDashboardLayout);

module.exports = router;
