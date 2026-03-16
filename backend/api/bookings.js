const express = require('express');
const router = express.Router();

// Add this after existing routes
router.post('/feedback', async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;
    
    // Validate input
    if (!bookingId || !rating || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, rating, and feedback'
      });
    }

    console.log('Feedback received:', {
      bookingId,
      rating,
      feedback,
      customerPhone: req.user?.phone // Assuming authenticated user is available
    });

    // TODO: Add your database logic here
    // Example: await Feedback.create({ bookingId, rating, feedback, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        bookingId,
        rating,
        feedback,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
