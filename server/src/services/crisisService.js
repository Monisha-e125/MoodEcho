const { detectCrisis } = require('../utils/crisisKeywords');
const { CRISIS_HELPLINES } = require('../config/constants');
const { getIO } = require('../config/socket');
const logger = require('../utils/logger');

class CrisisService {
  /**
   * Check mood entry for crisis signals
   * Returns crisis info + helplines if detected
   */
  static checkEntry(journalEntry, moodScore) {
    const result = {
      isCrisis: false,
      severity: 'none',
      helplines: [],
      message: null
    };

    // Check journal text
    if (journalEntry) {
      const textCheck = detectCrisis(journalEntry);
      if (textCheck.isCrisis) {
        result.isCrisis = true;
        result.severity = textCheck.severity;
      }
    }

    // Very low mood score is also a signal
    if (moodScore === 1) {
      if (!result.isCrisis) {
        result.severity = 'medium';
      }
      result.isCrisis = true;
    }

    // Add helplines and message if crisis detected
    if (result.isCrisis) {
      result.helplines = CRISIS_HELPLINES;

      if (result.severity === 'high') {
        result.message =
          "We're concerned about you. Please reach out to a mental health professional or call one of these helplines. You're not alone. 💙";
      } else {
        result.message =
          "It sounds like you're going through a tough time. Remember, it's okay to ask for help. Here are some resources. 💙";
      }

      logger.warn(
        `⚠️ Crisis detected — Severity: ${result.severity}`
      );
    }

    return result;
  }

  /**
   * Send real-time crisis notification to user
   */
  static notifyUser(userId, crisisData) {
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${userId}`).emit('crisis-detected', {
          severity: crisisData.severity,
          message: crisisData.message,
          helplines: crisisData.helplines
        });
      }
    } catch (error) {
      logger.error(`Crisis notification error: ${error.message}`);
    }
  }
}

module.exports = CrisisService;