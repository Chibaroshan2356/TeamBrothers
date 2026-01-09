const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create new booking/enquiry
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
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

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

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

module.exports = router;
