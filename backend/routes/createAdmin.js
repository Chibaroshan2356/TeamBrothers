const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Create or update admin user
// @route   POST /api/create-admin
// @access  Public (for initial setup)
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user to admin
      user.role = 'admin';
      await user.save();
      console.log('✅ Existing user updated to admin role:', email);
    } else {
      // Create new admin user
      user = new User({
        name: 'Admin',
        email: email,
        password: password,
        role: 'admin'
      });
      await user.save();
      console.log('✅ New admin user created:', email);
    }

    res.json({
      success: true,
      message: 'Admin user created/updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
