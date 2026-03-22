const { getModel } = require('../config/gemini');
const logger = require('../utils/logger');

class AIService {
  /**
   * Analyze mood journal entry using Gemini AI
   */
  static async analyzeMoodEntry(journalEntry, moodScore, emotions = []) {
    try {
      const model = getModel();

      if (!model) {
        logger.warn('⚠️ AI model not available — returning basic analysis');
        return this.getBasicAnalysis(moodScore, emotions);
      }

      const prompt = `You are a compassionate mental wellness AI assistant. Analyze this mood journal entry and provide insights.

MOOD SCORE: ${moodScore}/5
SELECTED EMOTIONS: ${emotions.join(', ') || 'none specified'}
JOURNAL ENTRY: "${journalEntry}"

Respond in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "sentiment": "very_negative|negative|neutral|positive|very_positive",
  "sentimentScore": <number between -1 and 1>,
  "dominantEmotion": "<single primary emotion>",
  "insights": "<2-3 sentence personalized insight about their emotional state>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}

Rules:
- Be empathetic and non-judgmental
- Suggestions should be actionable and gentle
- If mood is very low, suggest professional help as one suggestion
- Keep insights concise but meaningful
- Do NOT diagnose or provide medical advice`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean and parse JSON
      let cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const analysis = JSON.parse(cleaned);

      return {
        sentiment: analysis.sentiment || 'neutral',
        sentimentScore: parseFloat(analysis.sentimentScore) || 0,
        dominantEmotion: analysis.dominantEmotion || 'neutral',
        insights: analysis.insights || 'Keep tracking your mood to discover patterns.',
        suggestions: analysis.suggestions || ['Take a few deep breaths', 'Go for a short walk', 'Talk to someone you trust'],
        analyzedAt: new Date()
      };
    } catch (error) {
      logger.error(`AI analysis error: ${error.message}`);
      return this.getBasicAnalysis(moodScore, emotions);
    }
  }

  /**
   * Generate weekly mood insights
   */
  static async generateWeeklyInsights(moodEntries) {
    try {
      const model = getModel();

      if (!model || moodEntries.length === 0) {
        return {
          summary: 'Not enough data for weekly insights. Keep logging your mood!',
          patterns: [],
          recommendations: ['Log your mood daily for personalized insights']
        };
      }

      const moodData = moodEntries.map((entry) => ({
        date: entry.createdAt,
        score: entry.moodScore,
        emotions: entry.emotions,
        triggers: entry.triggers,
        journal: entry.journalEntry?.substring(0, 100)
      }));

      const prompt = `Analyze this week's mood data and provide insights.

MOOD DATA (${moodEntries.length} entries):
${JSON.stringify(moodData, null, 2)}

Respond in EXACT JSON format:
{
  "summary": "<3-4 sentence summary of the week's emotional patterns>",
  "averageMood": <number 1-5>,
  "moodTrend": "improving|stable|declining",
  "patterns": ["<pattern 1>", "<pattern 2>"],
  "topTriggers": ["<trigger 1>", "<trigger 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "positiveNote": "<one encouraging observation>"
}

Be empathetic, encouraging, and specific to their data.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      logger.error(`Weekly insights error: ${error.message}`);
      return {
        summary: 'Unable to generate insights. Keep logging for better analysis!',
        patterns: [],
        recommendations: ['Continue tracking your mood daily']
      };
    }
  }

  /**
   * Suggest wellness exercise based on current mood
   */
  static async suggestExercise(moodScore, emotions, recentActivities = []) {
    try {
      const model = getModel();

      if (!model) {
        return this.getDefaultSuggestion(moodScore);
      }

      const prompt = `Based on this user's current state, suggest ONE wellness exercise.

CURRENT MOOD: ${moodScore}/5
EMOTIONS: ${emotions.join(', ')}
RECENT ACTIVITIES: ${recentActivities.join(', ') || 'none'}

Available exercise types: breathing, gratitude, grounding, meditation, journaling, stretching, walking, music

Respond in EXACT JSON:
{
  "type": "<exercise type from list above>",
  "name": "<friendly name>",
  "description": "<1-2 sentence description>",
  "duration": <suggested duration in seconds>,
  "reason": "<why this exercise would help right now>"
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      logger.error(`Exercise suggestion error: ${error.message}`);
      return this.getDefaultSuggestion(moodScore);
    }
  }

  /**
   * Basic analysis fallback (when AI is unavailable)
   */
  static getBasicAnalysis(moodScore, emotions) {
    const sentimentMap = {
      1: { sentiment: 'very_negative', score: -0.8 },
      2: { sentiment: 'negative', score: -0.4 },
      3: { sentiment: 'neutral', score: 0 },
      4: { sentiment: 'positive', score: 0.4 },
      5: { sentiment: 'very_positive', score: 0.8 }
    };

    const mapped = sentimentMap[moodScore] || sentimentMap[3];

    return {
      sentiment: mapped.sentiment,
      sentimentScore: mapped.score,
      dominantEmotion: emotions[0] || 'neutral',
      insights: 'Keep tracking your mood to unlock AI-powered insights.',
      suggestions: [
        'Take a few deep breaths',
        'Go for a short walk',
        'Talk to someone you trust'
      ],
      analyzedAt: new Date()
    };
  }

  /**
   * Default exercise suggestion fallback
   */
  static getDefaultSuggestion(moodScore) {
    if (moodScore <= 2) {
      return {
        type: 'breathing',
        name: '4-7-8 Breathing',
        description: 'A calming breathing technique to reduce anxiety.',
        duration: 180,
        reason: 'Deep breathing activates your parasympathetic nervous system.'
      };
    } else if (moodScore === 3) {
      return {
        type: 'gratitude',
        name: 'Gratitude List',
        description: 'Write 3 things you\'re grateful for today.',
        duration: 300,
        reason: 'Gratitude shifts focus to positive aspects of life.'
      };
    } else {
      return {
        type: 'journaling',
        name: 'Joy Journal',
        description: 'Write about what made you happy today.',
        duration: 300,
        reason: 'Documenting positive moments reinforces happiness.'
      };
    }
  }
}

module.exports = AIService;