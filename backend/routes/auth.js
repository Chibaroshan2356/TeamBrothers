const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const admin = require('../config/firebaseAdmin');
const { firebaseInitialized } = require('../config/firebaseAdmin');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Create user
      user = new User({
        name,
        email,
        password,
        role: role || 'user',
      });

      await user.save();
      console.log('User saved successfully:', user._id);

      // Create token
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Registration error:', err.message);
      console.error('Full error:', err);
      res.status(500).send('Server error');
    }
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Create token
      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    // Check if Firebase is initialized
    if (!firebaseInitialized) {
      return res.status(503).json({ 
        success: false, 
        message: 'Google authentication is not configured on the server. Please contact the administrator.' 
      });
    }

    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID token is required' 
      });
    }

    // Verify ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    if (!decodedToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid ID token' 
      });
    }

    const { email, name, picture, uid } = decodedToken;
    
    // Check if user exists in our database
    console.log('🔍 Looking for user with email:', email);
    let user = await User.findOne({ email });
    console.log('👤 Found user:', user ? user._id : 'Not found');
    
    if (!user) {
      // Create new user with Google OAuth
      console.log('🆕 Creating new Google user for email:', email);
      user = new User({
        name: name || email.split('@')[0],
        email,
        googleId: uid,
        role: 'user',
        password: 'google-oauth-' + uid, // Placeholder password for Google users
      });
      
      await user.save();
      console.log('✅ New Google user created:', user._id);
    } else {
      console.log('✅ Existing user found, linking Google account');
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        user.googleId = uid;
        await user.save();
        console.log('🔗 Google ID linked to existing user');
      }
    }

    // Generate JWT token using the User model method
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: picture,
        rewardPoints: user.rewardPoints,
        tier: user.tier,
        totalBookings: user.totalBookings,
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during authentication' 
    });
  }
});

module.exports = router;
