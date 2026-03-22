const mongoose = require('mongoose');

const SupportRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 300
    },
    topic: {
      type: String,
      enum: ['general', 'anxiety', 'stress', 'loneliness',
             'work', 'relationships', 'grief', 'positivity'],
      default: 'general'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    maxUsers: {
      type: Number,
      default: 20
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportRoom', SupportRoomSchema);