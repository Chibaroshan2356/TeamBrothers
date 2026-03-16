const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// Get all analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalVehicles = await Vehicle.countDocuments();

    const activeVehicles = await Vehicle.countDocuments({
      available: true
    });

    const totalEnquiries = await Booking.countDocuments();

    const completedTrips = await Booking.countDocuments({
      status: "completed"
    });

    const revenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$estimatedCost" } } }
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    // Calculate average rating from feedback
    const bookingsWithFeedback = await Booking.find({
      status: "completed",
      feedback: { $ne: "" }
    });

    const avgRating = bookingsWithFeedback.length > 0 
      ? bookingsWithFeedback.reduce((sum, booking) => sum + (booking.rating || 0), 0) / bookingsWithFeedback.length
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVehicles,
        activeVehicles,
        totalEnquiries,
        completedTrips,
        totalRevenue,
        avgRating: avgRating.toFixed(1)
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Analytics error"
    });
  }
});

// Get vehicle usage analytics
router.get('/vehicle-usage', async (req, res) => {
  try {
    const usage = await Booking.aggregate([
      {
        $group: {
          _id: "$vehicleName",
          trips: { $sum: 1 },
          revenue: { $sum: "$estimatedCost" }
        }
      },
      { $sort: { trips: -1 } }
    ]);

    res.json({
      success: true,
      data: usage
    });

  } catch (error) {
    console.error('Vehicle usage error:', error);
    res.status(500).json({
      success: false,
      message: "Vehicle usage error"
    });
  }
});

// Get top routes
router.get('/top-routes', async (req, res) => {
  try {
    const routes = await Booking.aggregate([
      {
        $group: {
          _id: {
            pickup: "$pickupLocation",
            drop: "$dropLocation"
          },
          trips: { $sum: 1 },
          revenue: { $sum: "$estimatedCost" }
        }
      },
      { $sort: { trips: -1 } },
      { $limit: 10 }
    ]);

    const formattedRoutes = routes.map(route => ({
      route: `${route._id.pickup} → ${route._id.drop}`,
      trips: route.trips,
      revenue: route.revenue
    }));

    res.json({
      success: true,
      data: formattedRoutes
    });

  } catch (error) {
    console.error('Top routes error:', error);
    res.status(500).json({
      success: false,
      message: "Top routes error"
    });
  }
});

// Get monthly bookings trend
router.get('/monthly-bookings', async (req, res) => {
  try {
    const monthlyData = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$estimatedCost" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedData = monthlyData.map(item => ({
      month: monthNames[item._id.month - 1],
      bookings: item.bookings,
      revenue: item.revenue
    }));

    res.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Monthly bookings error:', error);
    res.status(500).json({
      success: false,
      message: "Monthly bookings error"
    });
  }
});

module.exports = router;
