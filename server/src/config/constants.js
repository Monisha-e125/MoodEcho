module.exports = {
  MOOD_SCORES: {
    TERRIBLE: 1,
    BAD: 2,
    OKAY: 3,
    GOOD: 4,
    GREAT: 5
  },

  MOOD_LABELS: ['Terrible', 'Bad', 'Okay', 'Good', 'Great'],

  EMOTIONS: [
    'happy', 'sad', 'anxious', 'angry', 'calm',
    'stressed', 'grateful', 'lonely', 'excited',
    'overwhelmed', 'hopeful', 'frustrated', 'peaceful',
    'confused', 'motivated', 'exhausted', 'content'
  ],

  TRIGGERS: [
    'work', 'family', 'relationships', 'health', 'money',
    'sleep', 'social', 'weather', 'exercise', 'food',
    'news', 'achievement', 'conflict', 'loneliness', 'other'
  ],

  WELLNESS_TYPES: [
    'breathing', 'gratitude', 'grounding', 'meditation',
    'journaling', 'stretching', 'walking', 'music'
  ],

  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 60 * 60 * 1000,
    AUTH_MAX_REQUESTS: 15
  },

  CRISIS_HELPLINES: [
    { country: 'India', name: 'iCall', number: '9152987821' },
    { country: 'India', name: 'Vandrevala Foundation', number: '1860-2662-345' },
    { country: 'India', name: 'AASRA', number: '9820466726' },
    { country: 'USA', name: 'Suicide & Crisis Lifeline', number: '988' },
    { country: 'USA', name: 'Crisis Text Line', number: 'Text HOME to 741741' },
    { country: 'UK', name: 'Samaritans', number: '116 123' },
    { country: 'Global', name: 'Befrienders', number: 'www.befrienders.org' }
  ]
};