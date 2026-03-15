const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: function() {
        // Password is not required for Google OAuth users
        return !this.googleId;
      },
      minlength: 6,
      select: false, // Don't return password in queries
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  // Skip password hashing if not modified or if it's a Google OAuth user
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    throw new Error('Server configuration error');
  }
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate and update user tier based on reward points
userSchema.methods.updateTier = function () {
  const points = this.rewardPoints;
  let newTier = 'bronze';
  
  if (points >= 500) {
    newTier = 'gold';
  } else if (points >= 200) {
    newTier = 'silver';
  }
  
  this.tier = newTier;
  return this.save();
};

// Award points for completed booking
userSchema.methods.awardPoints = async function (booking) {
  if (booking.status === 'completed' && !booking.pointsAwarded) {
    const pointsToAward = 50; // 50 points per completed trip
    
    this.rewardPoints += pointsToAward;
    this.totalBookings += 1;
    
    // Update tier based on new points
    await this.updateTier();
    
    // Mark booking as points awarded
    booking.pointsAwarded = true;
    await booking.save();
    
    return {
      pointsAwarded: pointsToAward,
      newTier: this.tier,
      totalPoints: this.rewardPoints
    };
  }
  
  return null;
};

module.exports = mongoose.model('User', userSchema);
