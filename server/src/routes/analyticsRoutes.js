const express = require('express');
const router = express.Router();
const {
  getMoodStats, getCalendar,
  getWeeklyInsights, getExerciseSuggestion
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getMoodStats);
router.get('/calendar', getCalendar);
router.get('/insights', getWeeklyInsights);
router.get('/suggest-exercise', getExerciseSuggestion);

module.exports = router;