const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

// GET /api/auth/google/url
const getGoogleAuthUrl = (req, res) => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      return res.status(500).json({ error: 'Google Client ID not configured' });
    }

    const scope = encodeURIComponent('email profile openid');
    const responseType = 'code';
    const accessType = 'offline';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&access_type=${accessType}`;

    res.json({ authUrl });
  } catch (err) {
    console.error('Get Google Auth URL error:', err);
    res.status(500).json({ error: 'Server error getting auth URL' });
  }
};

// POST /api/auth/google/callback
const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',
      grant_type: 'authorization_code',
    });

    const idToken = tokenResponse.data.id_token;
    const accessToken = tokenResponse.data.access_token;

    // Decode id_token to get user info (basic JWT decode without verification)
    const parts = idToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Could not get email from Google profile' });
    }

    // Look for user by email, create if doesn't exist (auto-signup)
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Auto-create account for first-time Google login
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        password: null, // Google OAuth users don't need a password
      });
    } else if (!user.googleId) {
      // Update existing user's googleId if not already set
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error('Google callback error:', err);
    if (err.response?.status === 400) {
      return res.status(400).json({ error: 'Invalid authorization code' });
    }
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
};

// GET /api/auth/google/callback - Handle OAuth redirect from Google
const googleCallbackRedirect = (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=No authorization code received`);
    }

    // Redirect to frontend login page with code as query parameter
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?code=${encodeURIComponent(code)}`);
  } catch (err) {
    console.error('Google callback redirect error:', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
  }
};

module.exports = { register, login, getMe, getGoogleAuthUrl, googleCallback, googleCallbackRedirect };