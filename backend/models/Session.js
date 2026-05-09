const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  topic: {
    type: String,
    enum: ['depression', 'stress', 'loneliness', 'academic', 'trauma', 'general'],
    default: 'general',
  },
  mood: { type: String, default: null },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt
sessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate title from first user message
sessionSchema.methods.generateTitle = function () {
  const firstUserMsg = this.messages.find(m => m.role === 'user');
  if (firstUserMsg) {
    this.title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '…' : '');
  }
};

module.exports = mongoose.model('Session', sessionSchema);