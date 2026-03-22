const { body } = require('express-validator');

const createMoodRules = [
  body('moodScore')
    .notEmpty().withMessage('Mood score is required')
    .isInt({ min: 1, max: 5 }).withMessage('Mood score must be 1-5'),

  body('moodLabel')
    .notEmpty().withMessage('Mood label is required')
    .isIn(['Terrible', 'Bad', 'Okay', 'Good', 'Great'])
    .withMessage('Invalid mood label'),

  body('journalEntry')
    .optional()
    .isLength({ max: 2000 }).withMessage('Journal entry max 2000 characters'),

  body('emotions')
    .optional()
    .isArray().withMessage('Emotions must be an array'),

  body('energyLevel')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Energy level must be 1-5'),

  body('sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 }).withMessage('Sleep hours must be 0-24'),

  body('triggers')
    .optional()
    .isArray().withMessage('Triggers must be an array')
];

module.exports = { createMoodRules };