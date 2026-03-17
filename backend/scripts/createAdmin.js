const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'chibaroshan23@gmail.com';
    const adminPassword = 'admin123';

    // Check if user already exists
    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      console.log('👤 User already exists, updating to admin role');
      user.role = 'admin';
      await user.save();
      console.log('✅ User updated to admin role');
    } else {
      console.log('🆕 Creating new admin user');
      user = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await user.save();
      console.log('✅ Admin user created successfully');
    }

    console.log(`📧 Admin email: ${adminEmail}`);
    console.log(`🔑 Admin password: ${adminPassword}`);
    console.log(`👤 User ID: ${user._id}`);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createAdminUser();
