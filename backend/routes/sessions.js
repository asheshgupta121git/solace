const express = require('express');
const router = express.Router();
const { getSessions, getSession, deleteSession } = require('../controllers/sessionsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getSessions);
router.get('/:id', protect, getSession);
router.delete('/:id', protect, deleteSession);

module.exports = router;