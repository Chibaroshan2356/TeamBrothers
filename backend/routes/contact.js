const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create new contact enquiry
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Contact creation error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get all contact enquiries
// @route   GET /api/contact
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Update contact status
// @route   PATCH /api/contact/:id/status
// @access  Private (Admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Update contact status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
