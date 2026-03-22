const express = require('express');
const router = express.Router();
const {
  getExercises, logActivity,
  getActivityHistory, getWellnessStats
} = require('../controllers/wellnessController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/exercises', getExercises);
router.post('/log', logActivity);
router.get('/history', getActivityHistory);
router.get('/stats', getWellnessStats);

module.exports = router;