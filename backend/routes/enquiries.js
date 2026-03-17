const express = require('express');
const router = express.Router();

// Get all enquiries
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all enquiries for admin');
    
    // Find the enquiry model - adjust path based on your actual model structure
    const Enquiry = require('../models/Enquiry') || require('../models/Contact');
    
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${enquiries.length} enquiries`);
    
    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message
    });
  }
});

// Update enquiry status
router.patch('/:id/status', async (req, res) => {
  try {
    console.log(`📝 Updating enquiry ${req.params.id} status`);
    
    const { status } = req.body;
    const { id } = req.params;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find the enquiry model
    const Enquiry = require('../models/Enquiry') || require('../models/Contact');
    
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
    
    console.log(`✅ Updated enquiry ${id} status to ${status}`);
    
    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: enquiry
    });
    
  } catch (error) {
    console.error('❌ Error updating enquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status',
      error: error.message
    });
  }
});

// Delete enquiry
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deleting enquiry ${req.params.id}`);
    
    const { id } = req.params;
    
    // Find the enquiry model
    const Enquiry = require('../models/Enquiry') || require('../models/Contact');
    
    const enquiry = await Enquiry.findByIdAndDelete(id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
    
    console.log(`✅ Deleted enquiry ${id}`);
    
    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry',
      error: error.message
    });
  }
});

// Get enquiry statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Fetching enquiry statistics');
    
    // Find the enquiry model
    const Enquiry = require('../models/Enquiry') || require('../models/Contact');
    
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'resolved' });
    
    console.log(`📊 Stats: Total=${totalEnquiries}, Pending=${pendingEnquiries}, Resolved=${resolvedEnquiries}`);
    
    res.json({
      success: true,
      data: {
        total: totalEnquiries,
        pending: pendingEnquiries,
        resolved: resolvedEnquiries,
        responseRate: totalEnquiries > 0 ? ((resolvedEnquiries / totalEnquiries) * 100).toFixed(1) : 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching enquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry statistics',
      error: error.message
    });
  }
});

module.exports = router;
