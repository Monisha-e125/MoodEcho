const express = require('express');
const router = express.Router();
const {
  createMoodEntry, getMoodHistory,
  getMoodEntry, deleteMoodEntry, getTodayEntries
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { createMoodRules } = require('../validators/moodValidator');

router.use(protect);

router.post('/', createMoodRules, validate, createMoodEntry);
router.get('/', getMoodHistory);
router.get('/today', getTodayEntries);
router.get('/:id', getMoodEntry);
router.delete('/:id', deleteMoodEntry);

module.exports = router;