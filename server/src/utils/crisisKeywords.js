/**
 * Crisis keyword detection for safety features
 * These patterns indicate potential mental health crisis
 */

const CRISIS_PATTERNS = {
  // High severity — immediate crisis
  high: [
    'want to die',
    'want to kill myself',
    'end my life',
    'suicide',
    'suicidal',
    'kill myself',
    'no reason to live',
    'better off dead',
    'can\'t go on',
    'don\'t want to exist',
    'end it all',
    'self harm',
    'self-harm',
    'hurt myself',
    'cutting myself',
    'overdose',
    'jump off',
    'hang myself'
  ],

  // Medium severity — distress signals
  medium: [
    'hopeless',
    'worthless',
    'nobody cares',
    'no one cares',
    'all alone',
    'can\'t take it anymore',
    'giving up',
    'no point',
    'hate myself',
    'hate my life',
    'burden to everyone',
    'trapped',
    'no way out',
    'want to disappear',
    'want to escape',
    'can\'t breathe',
    'panic attack',
    'breaking down'
  ]
};

/**
 * Check text for crisis keywords
 * @param {string} text - Text to analyze
 * @returns {{ isCrisis: boolean, severity: string, matchedPatterns: string[] }}
 */
const detectCrisis = (text) => {
  if (!text) return { isCrisis: false, severity: 'none', matchedPatterns: [] };

  const lowerText = text.toLowerCase().trim();
  const matchedPatterns = [];
  let severity = 'none';

  // Check high severity first
  for (const pattern of CRISIS_PATTERNS.high) {
    if (lowerText.includes(pattern)) {
      matchedPatterns.push(pattern);
      severity = 'high';
    }
  }

  // Check medium severity
  if (severity !== 'high') {
    for (const pattern of CRISIS_PATTERNS.medium) {
      if (lowerText.includes(pattern)) {
        matchedPatterns.push(pattern);
        severity = 'medium';
      }
    }
  }

  return {
    isCrisis: matchedPatterns.length > 0,
    severity,
    matchedPatterns
  };
};

module.exports = { detectCrisis, CRISIS_PATTERNS };