const mongoose = require('mongoose');

const WellnessActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['breathing', 'gratitude', 'grounding', 'meditation',
             'journaling', 'stretching', 'walking', 'music'],
      required: true
    },
    duration: {
      type: Number, // in seconds
      required: true
    },
    moodBefore: {
      type: Number,
      min: 1,
      max: 5
    },
    moodAfter: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: {
      type: String,
      maxlength: 500
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

WellnessActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('WellnessActivity', WellnessActivitySchema);