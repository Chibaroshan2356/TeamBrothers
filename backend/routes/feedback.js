const express = require('express');
const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    console.log('📝 New feedback submission');
    
    const { bookingId, userId, rating, comment, serviceType, feedbackType } = req.body;
    
    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }
    
    // Create feedback model if not exists
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const feedback = new Feedback({
      bookingId,
      userId,
      rating: Number(rating),
      comment: comment.trim(),
      serviceType: serviceType || 'vehicle-rental',
      feedbackType: feedbackType || 'general',
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await feedback.save();
    
    console.log(`✅ Feedback submitted for booking ${bookingId}`);
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
    
  } catch (error) {
    console.error('❌ Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// Get all feedback (admin)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all feedback for admin');
    
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .populate('bookingId', 'vehicleName pickupDate')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${feedback.length} feedback entries`);
    
    res.json({
      success: true,
      data: feedback,
      count: feedback.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// Get feedback for specific booking
router.get('/booking/:bookingId', async (req, res) => {
  try {
    console.log(`📋 Fetching feedback for booking ${req.params.bookingId}`);
    
    const { bookingId } = req.params;
    
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const feedback = await Feedback.find({ bookingId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${feedback.length} feedback entries for booking ${bookingId}`);
    
    res.json({
      success: true,
      data: feedback,
      count: feedback.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching booking feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking feedback',
      error: error.message
    });
  }
});

// Update feedback status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    console.log(`📝 Updating feedback ${req.params.id} status`);
    
    const { status } = req.body;
    const { id } = req.params;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    console.log(`✅ Updated feedback ${id} status to ${status}`);
    
    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback
    });
    
  } catch (error) {
    console.error('❌ Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
});

// Delete feedback (admin)
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deleting feedback ${req.params.id}`);
    
    const { id } = req.params;
    
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const feedback = await Feedback.findByIdAndDelete(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    console.log(`✅ Deleted feedback ${id}`);
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
});

// Get feedback statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Fetching feedback statistics');
    
    const Feedback = require('../models/Feedback') || require('../models/Booking');
    
    const totalFeedback = await Feedback.countDocuments();
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const ratingDistribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    console.log(`📊 Stats: Total=${totalFeedback}, Avg=${averageRating[0]?.avgRating || 0}, Recent=${recentFeedback}`);
    
    res.json({
      success: true,
      data: {
        total: totalFeedback,
        averageRating: averageRating[0]?.avgRating?.toFixed(1) || 0,
        ratingDistribution,
        recentCount: recentFeedback,
        responseRate: totalFeedback > 0 ? ((recentFeedback / totalFeedback) * 100).toFixed(1) : 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
});

module.exports = router;
