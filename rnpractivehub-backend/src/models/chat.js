const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video'],
    default: 'text',
  },
  mediaUrl: {
    type: String,
    default:''
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  seenAt: {
    type: Date,
  },
}, {
  timestamps: true, // 👈 auto createdAt + updatedAt
});

module.exports = mongoose.model('Chat', chatSchema);
