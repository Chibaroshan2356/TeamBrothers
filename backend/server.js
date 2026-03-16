const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./api/analytics');
const vehiclesRoutes = require('./routes/vehicles');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://team-brothers-eight.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Root health check route
app.get("/", (req, res) => {
  res.send("TeamBrothers API running 🚀");
});

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vehicles', vehiclesRoutes);

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

// Use Render dynamic port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});