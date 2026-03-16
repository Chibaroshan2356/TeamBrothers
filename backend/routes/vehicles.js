const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// @desc    Update vehicle availability
// @route   PATCH /api/vehicles/:id/availability
// @access  Private
router.patch('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    vehicle.available = available;
    await vehicle.save();

    res.json({
      success: true,
      message: `Vehicle marked as ${available ? 'available' : 'unavailable'}`,
      data: {
        id: vehicle._id,
        name: vehicle.name,
        available: vehicle.available
      }
    });

  } catch (error) {
    console.error('Update vehicle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
