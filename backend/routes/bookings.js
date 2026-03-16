const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get booking availability for vehicles
// @route   GET /api/bookings/availability
// @access  Public
router.get('/availability', async (req, res) => {
  try {
    const { pickupDate, returnDate, vehicleId } = req.query;

    // If specific vehicle requested, check its availability
    if (vehicleId && pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnDateObj = new Date(returnDate);

      // Validate dates
      if (pickup >= returnDateObj) {
        return res.status(400).json({
          success: false,
          message: 'Return date must be after pickup date'
        });
      }

      // Find existing bookings that overlap with the requested date range
      const existingBookings = await Booking.find({
        vehicleId,
        status: { $in: ['pending', 'approved', 'completed'] },
        $or: [
          {
            pickupDate: { $lte: pickup },
            returnDate: { $gte: pickup }
          },
          {
            pickupDate: { $lte: returnDateObj },
            returnDate: { $gte: returnDateObj }
          },
          {
            pickupDate: { $gte: pickup },
            returnDate: { $lte: returnDateObj }
          }
        ]
      });

      const isAvailable = existingBookings.length === 0;

      return res.json({
        success: true,
        vehicleId,
        isAvailable,
        conflictingBookings: existingBookings.length,
        message: isAvailable 
          ? 'Vehicle is available for the selected dates' 
          : 'Vehicle is not available for the selected dates'
      });
    }

    // If no specific vehicle, return success with empty vehicles array
    // Frontend will use vehicles from context
    res.json({
      success: true,
      vehicles: [],
      message: 'Availability check endpoint working'
    });

  } catch (error) {
    console.error('Get availability error:', error);
    // If database is not available, assume vehicle is available for development
    if (error.name === 'MongooseError' || error.message.includes('ECONNREFUSED')) {
      return res.json({
        success: true,
        vehicleId,
        isAvailable: true,
        conflictingBookings: 0,
        message: 'Vehicle availability check completed (database unavailable)'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while getting availability'
    });
  }
});

// @desc    Create new booking/enquiry
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    // Add user ID to booking data
    const bookingData = {
      ...req.body,
      user: req.user.id
    };

    // Check for conflicting bookings
    const existingBookings = await Booking.find({
      vehicleId,
      status: { $in: ['pending', 'approved', 'completed'] },
      $or: [
        {
          pickupDate: { $lte: new Date(pickupDate) },
          returnDate: { $gte: new Date(pickupDate) }
        },
        {
          pickupDate: { $lte: new Date(returnDate) },
          returnDate: { $gte: new Date(returnDate) }
        },
        {
          pickupDate: { $gte: new Date(pickupDate) },
          returnDate: { $lte: new Date(returnDate) }
        }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for the selected dates'
      });
    }

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get user bookings error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Cancel user's booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'confirmed', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user');

    // Award points if booking is completed
    if (status === 'completed' && booking.user) {
      const User = require('../models/User');
      const user = await User.findById(booking.user._id);
      
      if (user) {
        const result = await user.awardPoints(booking);
        
        if (result) {
          console.log(`Awarded ${result.pointsAwarded} points to user ${user.name}. New tier: ${result.newTier}`);
        }
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Feedback submission route
router.post('/feedback', async (req, res) => {
  try {
    const { bookingId, feedback } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.feedback = feedback;
    booking.feedbackDate = new Date();

    await booking.save();

    console.log('Feedback saved to booking:', bookingId);

    res.json({
      success: true,
      message: "Feedback saved successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
