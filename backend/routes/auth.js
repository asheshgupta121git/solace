const express = require('express');
const router = express.Router();
const { register, login, getMe, getGoogleAuthUrl, googleCallback, googleCallbackRedirect } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallbackRedirect);
router.post('/google/callback', googleCallback);

module.exports = router;