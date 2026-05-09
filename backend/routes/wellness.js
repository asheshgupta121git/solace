const express = require('express');
const router = express.Router();
const { getTodayWellness, updateWellness } = require('../controllers/wellnessController');
const { protect } = require('../middleware/auth');

router.get('/today', protect, getTodayWellness);
router.put('/today', protect, updateWellness);

module.exports = router;
