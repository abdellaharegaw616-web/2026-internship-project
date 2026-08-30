const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  markAsRead,
  deleteConversation,
} = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id', getConversation);
router.put('/conversations/:id/read', markAsRead);
router.delete('/conversations/:id', deleteConversation);
router.post('/conversations/:id/messages', sendMessage);

module.exports = router;
