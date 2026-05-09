const mongoose = require('mongoose');

const wellnessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  meditationMinutes: { type: Number, default: 0 },
  tasks: [
    {
      id: { type: String, required: true },
      text: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only one wellness record per user per day
wellnessSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Wellness', wellnessSchema);
