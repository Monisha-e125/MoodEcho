const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create and send a notification
   */
  static async create(userId, type, title, message, data = null) {
    try {
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        data
      });

      // Send real-time notification via Socket.IO
      try {
        const io = getIO();
        if (io) {
          io.to(`user:${userId.toString()}`).emit('notification', {
            _id: notification._id,
            type,
            title,
            message,
            data,
            isRead: false,
            createdAt: notification.createdAt
          });
        }
      } catch (socketErr) {
        logger.warn(`Socket notification failed: ${socketErr.message}`);
      }

      return notification;
    } catch (error) {
      logger.error(`Create notification error: ${error.message}`);
      return null;
    }
  }

  /**
   * Send mood reminder notification
   */
  static async sendMoodReminder(userId) {
    return this.create(
      userId,
      'mood_reminder',
      '🧠 Time to check in!',
      "How are you feeling right now? Take a moment to log your mood.",
      null
    );
  }

  /**
   * Send streak milestone notification
   */
  static async sendStreakMilestone(userId, streakDays) {
    const milestoneMessages = {
      3: "3 days in a row! You're building a great habit! 🌱",
      7: "1 week streak! Consistency is key to self-awareness! 🔥",
      14: "2 weeks strong! You're truly committed! ⭐",
      30: "30 day streak! Incredible dedication! 🏆",
      60: "60 days! You're a mood tracking champion! 👑",
      100: "100 days! Legendary streak! 🎯"
    };

    const message = milestoneMessages[streakDays];
    if (!message) return null;

    return this.create(
      userId,
      'streak_milestone',
      `🔥 ${streakDays}-Day Streak!`,
      message,
      { streakDays }
    );
  }

  /**
   * Send crisis resources notification
   */
  static async sendCrisisResources(userId, severity) {
    const title = severity === 'high'
      ? '💙 We care about you'
      : '💙 Support is available';

    const message = severity === 'high'
      ? "We noticed you might be going through a really tough time. Please reach out to a professional — you deserve support."
      : "It seems like things are difficult right now. Remember, it's okay to ask for help.";

    return this.create(
      userId,
      'crisis_resources',
      title,
      message,
      { severity, showHelplines: true }
    );
  }

  /**
   * Send wellness suggestion notification
   */
  static async sendWellnessSuggestion(userId, exerciseType, reason) {
    return this.create(
      userId,
      'wellness_suggestion',
      '🧘 Wellness Suggestion',
      reason || `Try a ${exerciseType} exercise to improve your mood.`,
      { exerciseType }
    );
  }

  /**
   * Send weekly report notification
   */
  static async sendWeeklyReportReady(userId) {
    return this.create(
      userId,
      'weekly_report',
      '📊 Weekly Report Ready',
      'Your weekly mood insights are ready! Check your analytics dashboard.',
      null
    );
  }

  /**
   * Send encouragement received notification
   */
  static async sendEncouragement(userId, fromName, message) {
    return this.create(
      userId,
      'encouragement',
      '💛 You received encouragement!',
      message || `${fromName} sent you some positive vibes!`,
      { fromName }
    );
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        user: userId,
        isRead: false
      });
    } catch (error) {
      logger.error(`Unread count error: ${error.message}`);
      return 0;
    }
  }

  /**
   * Mark all as read for a user
   */
  static async markAllRead(userId) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );
      return true;
    } catch (error) {
      logger.error(`Mark all read error: ${error.message}`);
      return false;
    }
  }
}

module.exports = NotificationService;