const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Core mood data
    moodScore: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: 1,
      max: 5
    },
    moodLabel: {
      type: String,
      enum: ['Terrible', 'Bad', 'Okay', 'Good', 'Great'],
      required: true
    },

    // Journal entry (the KEY differentiator)
    journalEntry: {
      type: String,
      maxlength: [2000, 'Journal entry cannot exceed 2000 characters'],
      default: ''
    },

    // Emotions (multiple select)
    emotions: [
      {
        type: String,
        enum: [
          'happy', 'sad', 'anxious', 'angry', 'calm',
          'stressed', 'grateful', 'lonely', 'excited',
          'overwhelmed', 'hopeful', 'frustrated', 'peaceful',
          'confused', 'motivated', 'exhausted', 'content'
        ]
      }
    ],

    // Additional factors
    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24
    },
    sleepQuality: {
      type: Number,
      min: 1,
      max: 5
    },

    // Triggers
    triggers: [
      {
        type: String,
        enum: [
          'work', 'family', 'relationships', 'health', 'money',
          'sleep', 'social', 'weather', 'exercise', 'food',
          'news', 'achievement', 'conflict', 'loneliness', 'other'
        ]
      }
    ],

    // AI Analysis Results
    aiAnalysis: {
      sentiment: {
        type: String,
        enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive']
      },
      sentimentScore: {
        type: Number,
        min: -1,
        max: 1
      },
      dominantEmotion: String,
      insights: String,
      suggestions: [String],
      analyzedAt: Date
    },

    // Crisis detection
    crisisDetected: {
      type: Boolean,
      default: false
    },
    crisisSeverity: {
      type: String,
      enum: ['none', 'medium', 'high'],
      default: 'none'
    },

    // Metadata
    loggedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
MoodEntrySchema.index({ user: 1, createdAt: -1 });
MoodEntrySchema.index({ user: 1, loggedAt: -1 });
MoodEntrySchema.index({ user: 1, moodScore: 1 });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);