const AnalyticsService = require('../services/analyticsService');
const AIService = require('../services/aiService');
const MoodEntry = require('../models/MoodEntry');
const ApiResponse = require('../utils/apiResponse');

// GET MOOD STATS
exports.getMoodStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const stats = await AnalyticsService.getMoodStats(req.user._id, days);
    return ApiResponse.success(res, stats);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch analytics');
  }
};

// GET CALENDAR DATA
exports.getCalendar = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const data = await AnalyticsService.getCalendarData(req.user._id, year, month);
    return ApiResponse.success(res, data);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch calendar');
  }
};

// GET AI WEEKLY INSIGHTS
exports.getWeeklyInsights = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await MoodEntry.find({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 });

    const insights = await AIService.generateWeeklyInsights(entries);
    return ApiResponse.success(res, insights);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to generate insights');
  }
};

// GET AI EXERCISE SUGGESTION
exports.getExerciseSuggestion = async (req, res) => {
  try {
    const moodScore = parseInt(req.query.mood) || 3;
    const emotions = req.query.emotions?.split(',') || [];

    const suggestion = await AIService.suggestExercise(moodScore, emotions);
    return ApiResponse.success(res, suggestion);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to get suggestion');
  }
};