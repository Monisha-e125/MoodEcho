const SupportRoom = require('../models/SupportRoom');
const Message = require('../models/Message');
const ApiResponse = require('../utils/apiResponse');
const { CRISIS_HELPLINES } = require('../config/constants');

// GET SUPPORT ROOMS
exports.getRooms = async (req, res) => {
  try {
    const rooms = await SupportRoom.find({ isActive: true })
      .sort({ activeUsers: -1 });
    return ApiResponse.success(res, rooms);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch rooms');
  }
};

// GET ROOM MESSAGES
exports.getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    return ApiResponse.success(res, messages.reverse());
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch messages');
  }
};

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const message = await Message.create({
      room: req.params.roomId,
      sender: req.user._id,
      content,
      isAnonymous: isAnonymous !== false
    });

    const populated = await message.populate('sender', 'name avatar');
    return ApiResponse.created(res, populated);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to send message');
  }
};

// GET CRISIS HELPLINES
exports.getHelplines = async (req, res) => {
  try {
    return ApiResponse.success(res, CRISIS_HELPLINES);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch helplines');
  }
};