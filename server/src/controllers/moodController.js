const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');
const AIService = require('../services/aiService');
const CrisisService = require('../services/crisisService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// ═══════════════════════════════════════════
// ✅ HELPER — Update mood streak (not exported as route)
// ═══════════════════════════════════════════
const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.moodStreak.lastLogDate) {
      const lastLog = new Date(user.moodStreak.lastLogDate);
      lastLog.setHours(0, 0, 0, 0);

      if (lastLog.getTime() === yesterday.getTime()) {
        user.moodStreak.current += 1;
      } else if (lastLog.getTime() < yesterday.getTime()) {
        user.moodStreak.current = 1;
      }
    } else {
      user.moodStreak.current = 1;
    }

    if (user.moodStreak.current > user.moodStreak.longest) {
      user.moodStreak.longest = user.moodStreak.current;
    }

    user.moodStreak.lastLogDate = new Date();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    logger.error(`Streak update error: ${error.message}`);
  }
};

// ═══════════════════════════════════════════
// CREATE MOOD ENTRY
// ═══════════════════════════════════════════
exports.createMoodEntry = async (req, res) => {
  try {
    const {
      moodScore, moodLabel, journalEntry,
      emotions, energyLevel, sleepHours,
      sleepQuality, triggers
    } = req.body;

    logger.info(`📝 Mood log attempt: user=${req.user._id}, score=${moodScore}`);

    // 1. Crisis Detection
    let crisisCheck = { isCrisis: false, severity: 'none' };
    try {
      crisisCheck = CrisisService.checkEntry(journalEntry, moodScore);
    } catch (crisisErr) {
      logger.warn(`Crisis check error: ${crisisErr.message}`);
    }

    // 2. AI Analysis (if journal entry provided)
    let aiAnalysis = null;
    if (journalEntry && journalEntry.trim().length > 10) {
      try {
        aiAnalysis = await AIService.analyzeMoodEntry(
          journalEntry,
          moodScore,
          emotions || []
        );
      } catch (aiErr) {
        logger.warn(`AI analysis error: ${aiErr.message}`);
      }
    }

    // 3. Create mood entry
    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      moodScore,
      moodLabel,
      journalEntry: journalEntry || '',
      emotions: emotions || [],
      energyLevel,
      sleepHours,
      sleepQuality,
      triggers: triggers || [],
      aiAnalysis: aiAnalysis || undefined,
      crisisDetected: crisisCheck.isCrisis,
      crisisSeverity: crisisCheck.severity
    });

    // 4. Update mood streak (✅ FIXED — direct function call)
    await updateStreak(req.user._id);

    // 5. Send crisis notification if detected
    if (crisisCheck.isCrisis) {
      try {
        CrisisService.notifyUser(req.user._id.toString(), crisisCheck);
      } catch (notifyErr) {
        logger.warn(`Crisis notify error: ${notifyErr.message}`);
      }
    }

    // 6. Build response
    const responseData = {
      entry: moodEntry,
      aiInsights: aiAnalysis
        ? {
            sentiment: aiAnalysis.sentiment,
            insights: aiAnalysis.insights,
            suggestions: aiAnalysis.suggestions
          }
        : null,
      crisis: crisisCheck.isCrisis
        ? {
            severity: crisisCheck.severity,
            message: crisisCheck.message,
            helplines: crisisCheck.helplines
          }
        : null
    };

    logger.info(`✅ Mood logged: user=${req.user._id}, score=${moodScore}`);

    return ApiResponse.created(res, responseData, 'Mood logged successfully! 📝');
  } catch (error) {
    logger.error(`❌ Create mood error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    return ApiResponse.error(res, 'Failed to log mood');
  }
};

// ═══════════════════════════════════════════
// GET MOOD HISTORY
// ═══════════════════════════════════════════
exports.getMoodHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const days = parseInt(req.query.days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filter = {
      user: req.user._id,
      createdAt: { $gte: startDate }
    };

    const [entries, total] = await Promise.all([
      MoodEntry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      MoodEntry.countDocuments(filter)
    ]);

    return ApiResponse.paginated(res, entries, page, limit, total);
  } catch (error) {
    logger.error(`Get mood history error: ${error.message}`);
    return ApiResponse.error(res, 'Failed to fetch mood history');
  }
};

// ═══════════════════════════════════════════
// GET SINGLE MOOD ENTRY
// ═══════════════════════════════════════════
exports.getMoodEntry = async (req, res) => {
  try {
    const entry = await MoodEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) return ApiResponse.notFound(res, 'Mood entry not found');
    return ApiResponse.success(res, entry);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch mood entry');
  }
};

// ═══════════════════════════════════════════
// DELETE MOOD ENTRY
// ═══════════════════════════════════════════
exports.deleteMoodEntry = async (req, res) => {
  try {
    const entry = await MoodEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) return ApiResponse.notFound(res, 'Mood entry not found');
    return ApiResponse.success(res, null, 'Mood entry deleted');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to delete mood entry');
  }
};

// ═══════════════════════════════════════════
// GET TODAY'S ENTRIES
// ═══════════════════════════════════════════
exports.getTodayEntries = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = await MoodEntry.find({
      user: req.user._id,
      createdAt: { $gte: today }
    }).sort({ createdAt: -1 });

    return ApiResponse.success(res, entries);
  } catch (error) {
    return ApiResponse.error(res, "Failed to fetch today's entries");
  }
};