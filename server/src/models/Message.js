const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportRoom',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isAnonymous: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['message', 'encouragement', 'system'],
      default: 'message'
    }
  },
  { timestamps: true }
);

MessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);