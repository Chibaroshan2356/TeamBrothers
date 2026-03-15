const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @desc    Check vehicle availability for given date range
// @route   GET /api/availability/check/:vehicleId
// @access  Public
router.get('/check/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { pickupDate, returnDate } = req.query;

    if (!pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date and return date are required'
      });
    }

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
        // Pickup date falls within an existing booking
        {
          pickupDate: { $lte: pickup },
          returnDate: { $gte: pickup }
        },
        // Return date falls within an existing booking
        {
          pickupDate: { $lte: returnDateObj },
          returnDate: { $gte: returnDateObj }
        },
        // Requested dates completely encompass an existing booking
        {
          pickupDate: { $gte: pickup },
          returnDate: { $lte: returnDateObj }
        }
      ]
    });

    const isAvailable = existingBookings.length === 0;

    res.json({
      success: true,
      isAvailable,
      conflictingBookings: existingBookings.length,
      message: isAvailable 
        ? 'Vehicle is available for the selected dates' 
        : 'Vehicle is not available for the selected dates'
    });

  } catch (error) {
    console.error('Availability check error:', error);
    // If database is not available, assume vehicle is available for development
    if (error.name === 'MongooseError' || error.message.includes('ECONNREFUSED')) {
      return res.json({
        success: true,
        isAvailable: true,
        conflictingBookings: 0,
        message: 'Vehicle is available for the selected dates (database unavailable)'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while checking availability'
    });
  }
});

// @desc    Get all booked dates for a vehicle
// @route   GET /api/availability/booked-dates/:vehicleId
// @access  Public
router.get('/booked-dates/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const bookings = await Booking.find({
      vehicleId,
      status: { $in: ['pending', 'approved', 'completed'] }
    }).select('pickupDate returnDate');

    const bookedDates = bookings.map(booking => ({
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate
    }));

    res.json({
      success: true,
      bookedDates
    });

  } catch (error) {
    console.error('Get booked dates error:', error);
    // If database is not available, return empty array for development
    if (error.name === 'MongooseError' || error.message.includes('ECONNREFUSED')) {
      return res.json({
        success: true,
        bookedDates: []
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while getting booked dates'
    });
  }
});

module.exports = router;
