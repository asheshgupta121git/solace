const Wellness = require('../models/Wellness');

const DEFAULT_TASKS = [
  { id: 'task-1', text: 'Drink a full glass of water upon waking up' },
  { id: 'task-2', text: 'Take a 5-minute offline break' },
  { id: 'task-3', text: 'Stretch or do light exercises' },
  { id: 'task-4', text: 'Write down one thing I am grateful for' },
  { id: 'task-5', text: 'Listen to a calming song' }
];

const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// GET /api/wellness/today
const getTodayWellness = async (req, res) => {
  try {
    const today = getTodayDateString();
    let record = await Wellness.findOne({ user: req.user._id, date: today });
    
    // Auto-create today's record if missing
    if (!record) {
      record = await Wellness.create({
        user: req.user._id,
        date: today,
        tasks: DEFAULT_TASKS
      });
    }
    res.json(record);
  } catch (err) {
    console.error('Wellness GET error:', err);
    res.status(500).json({ error: 'Failed to fetch wellness data.' });
  }
};

// PUT /api/wellness/today
const updateWellness = async (req, res) => {
  try {
    const today = getTodayDateString();
    const { steps, water, taskId, taskCompleted, meditationMinutes } = req.body;
    
    let record = await Wellness.findOne({ user: req.user._id, date: today });
    if (!record) return res.status(404).json({ error: 'Today\'s wellness record not found.' });

    // Update fields if provided
    if (steps !== undefined) record.steps = steps;
    if (water !== undefined) record.water = water;
    if (meditationMinutes !== undefined) record.meditationMinutes += meditationMinutes;

    // Toggle specific task completion
    if (taskId !== undefined) {
      const task = record.tasks.find(t => t.id === taskId);
      if (task) task.completed = taskCompleted;
    }

    record.updatedAt = Date.now();
    await record.save();
    
    res.json(record);
  } catch (err) {
    console.error('Wellness PUT error:', err);
    res.status(500).json({ error: 'Failed to update wellness data.' });
  }
};

module.exports = { getTodayWellness, updateWellness };
