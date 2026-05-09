const Session = require('../models/Session');

// GET /api/sessions — list all sessions for user
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .select('_id title topic mood createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
};

// GET /api/sessions/:id — get full session with messages
const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
};

// DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session.' });
  }
};

module.exports = { getSessions, getSession, deleteSession };