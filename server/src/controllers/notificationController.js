const Notification = require('../models/Notification');
const NotificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';

    const filter = { user: req.user._id };
    if (unreadOnly) filter.isRead = false;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter)
    ]);

    return ApiResponse.paginated(res, notifications, page, limit, total);
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to fetch notifications');
  }
};

// GET UNREAD COUNT
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user._id);
    return ApiResponse.success(res, { unreadCount: count });
  } catch (error) {
    return ApiResponse.error(res, 'Failed to get unread count');
  }
};

// MARK SINGLE AS READ
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return ApiResponse.notFound(res, 'Notification not found');
    }

    return ApiResponse.success(res, notification, 'Marked as read');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to mark as read');
  }
};

// MARK ALL AS READ
exports.markAllAsRead = async (req, res) => {
  try {
    await NotificationService.markAllRead(req.user._id);
    return ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to mark all as read');
  }
};

// DELETE NOTIFICATION
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return ApiResponse.notFound(res, 'Notification not found');
    }

    return ApiResponse.success(res, null, 'Notification deleted');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to delete notification');
  }
};

// CLEAR ALL NOTIFICATIONS
exports.clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    return ApiResponse.success(res, null, 'All notifications cleared');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to clear notifications');
  }
};