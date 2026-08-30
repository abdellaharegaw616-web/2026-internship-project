const { Message, Conversation } = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar email')
      .populate('lastMessage')
      .populate('createdBy', 'name avatar')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation with messages
// @route   GET /api/messages/conversations/:id
// @access  Private
const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name avatar email')
      .populate('createdBy', 'name avatar');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversation: req.params.id, recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, conversation, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new conversation
// @route   POST /api/messages/conversations
// @access  Private
const createConversation = async (req, res, next) => {
  try {
    const { participants, isGroup, name } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 participants required' });
    }

    // Add current user to participants if not included
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id.toString());
    }

    // Check if direct conversation already exists
    if (!isGroup && participants.length === 2) {
      const existing = await Conversation.findOne({
        participants: { $all: participants, $size: 2 },
        isGroup: false,
      });
      if (existing) {
        return res.json({ success: true, conversation: existing });
      }
    }

    const conversation = await Conversation.create({
      participants,
      isGroup: isGroup || false,
      name: isGroup ? name : null,
      createdBy: req.user._id,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar email')
      .populate('createdBy', 'name avatar');

    res.status(201).json({ success: true, conversation: populatedConversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { content, attachments } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const message = await Message.create({
      sender: req.user._id,
      conversation: req.params.id,
      content,
      attachments: attachments || [],
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Emit socket event for real-time messaging
    const { getIO } = require('../config/socket');
    const io = getIO();
    if (io) {
      conversation.participants.forEach(participantId => {
        io.to(`user:${participantId}`).emit('new_message', {
          conversationId: req.params.id,
          message: populatedMessage,
        });
      });
    }

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/conversations/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await Message.updateMany(
      { conversation: req.params.id, recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversation
// @route   DELETE /api/messages/conversations/:id
// @access  Private
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Only creator or admin can delete group conversations
    if (conversation.isGroup && conversation.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete all messages in conversation
    await Message.deleteMany({ conversation: req.params.id });
    await conversation.deleteOne();

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  markAsRead,
  deleteConversation,
};
