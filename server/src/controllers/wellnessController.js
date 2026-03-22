const WellnessActivity = require('../models/WellnessActivity');
const ApiResponse = require('../utils/apiResponse');
const { WELLNESS_TYPES } = require('../config/constants');

// BREATHING EXERCISES DATA
const EXERCISES = {
  breathing: [
    {
      id: 'box-breathing',
      name: 'Box Breathing',
      description: 'Breathe in 4s, hold 4s, out 4s, hold 4s. Repeat.',
      duration: 240,
      steps: [
        { action: 'Breathe In', seconds: 4 },
        { action: 'Hold', seconds: 4 },
        { action: 'Breathe Out', seconds: 4 },
        { action: 'Hold', seconds: 4 }
      ]
    },
    {
      id: '478-breathing',
      name: '4-7-8 Breathing',
      description: 'Calming technique: In 4s, hold 7s, out 8s.',
      duration: 180,
      steps: [
        { action: 'Breathe In', seconds: 4 },
        { action: 'Hold', seconds: 7 },
        { action: 'Breathe Out', seconds: 8 }
      ]
    }
  ],
  gratitude: [
    {
      id: 'gratitude-3',
      name: 'Three Good Things',
      description: 'Write 3 things you\'re grateful for today.',
      duration: 300,
      prompts: [
        'Something that made you smile today',
        'A person you\'re thankful for',
        'Something small but good that happened'
      ]
    }
  ],
  grounding: [
    {
      id: '54321',
      name: '5-4-3-2-1 Grounding',
      description: 'Engage your senses to ground yourself in the present.',
      duration: 300,
      steps: [
        { sense: 'See', count: 5, prompt: 'Name 5 things you can see' },
        { sense: 'Touch', count: 4, prompt: 'Name 4 things you can feel' },
        { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear' },
        { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell' },
        { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste' }
      ]
    }
  ]
};

// GET EXERCISES
exports.getExercises = async (req, res) => {
  try {
    const type = req.query.type;
    if (type && EXERCISES[type]) {
      return ApiResponse.success(res, EXERCISES[type]);
    }
    return ApiResponse.success(res, EXERCISES);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch exercises');
  }
};

// LOG COMPLETED ACTIVITY
exports.logActivity = async (req, res) => {
  try {
    const { type, duration, moodBefore, moodAfter, notes } = req.body;

    const activity = await WellnessActivity.create({
      user: req.user._id,
      type,
      duration,
      moodBefore,
      moodAfter,
      notes
    });

    return ApiResponse.created(res, activity, 'Activity logged! 🧘');
  } catch (error) {
    return ApiResponse.error(res, 'Failed to log activity');
  }
};

// GET ACTIVITY HISTORY
exports.getActivityHistory = async (req, res) => {
  try {
    const activities = await WellnessActivity.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return ApiResponse.success(res, activities);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch activities');
  }
};

// GET WELLNESS STATS
exports.getWellnessStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await WellnessActivity.find({
      user: req.user._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalActivities = activities.length;
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);

    // Average mood improvement
    const withBothMoods = activities.filter(
      (a) => a.moodBefore && a.moodAfter
    );
    const avgImprovement =
      withBothMoods.length > 0
        ? withBothMoods.reduce((sum, a) => sum + (a.moodAfter - a.moodBefore), 0) /
          withBothMoods.length
        : 0;

    // Activity type breakdown
    const typeCount = {};
    activities.forEach((a) => {
      typeCount[a.type] = (typeCount[a.type] || 0) + 1;
    });

    return ApiResponse.success(res, {
      totalActivities,
      totalDurationMinutes: Math.round(totalDuration / 60),
      averageMoodImprovement: parseFloat(avgImprovement.toFixed(2)),
      activityBreakdown: typeCount,
      period: 'Last 30 days'
    });
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch stats');
  }
};