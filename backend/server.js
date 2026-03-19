const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize Firebase Admin
require('./config/firebaseAdmin');

// Load env variables
require('dotenv').config();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err.message);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./api/analytics');
const vehiclesRoutes = require('./routes/vehicles');
const createAdminRoutes = require('./routes/createAdmin');
const enquiriesRoutes = require('./routes/enquiries');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Body parser
app.use(express.json());

// CORS (for Vercel frontend)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://team-brothers-eight.vercel.app"
    "http://13.60.216.98"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.options("*", cors());

// Health check route
app.get("/", (req, res) => {
  res.send("TeamBrothers API running 🚀");
});

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/create-admin', createAdminRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/feedback', feedbackRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: 'Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal Server Error'
  });
});

// PORT (Render uses dynamic port)
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);

  server.close(() => process.exit(1));
});
