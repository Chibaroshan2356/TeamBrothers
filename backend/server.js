const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const connectDB = require('./config/db');

const path = require('path');



// Load env vars

require('dotenv').config();



// Connect to database

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

app.use(cors());

app.get("/", (req, res) => {
  res.send("TeamBrothers API running 🚀");
});
// Dev logging middleware

if (process.env.NODE_ENV === 'development') {

  app.use(morgan('dev'));

}



// Mount routers

app.use('/api/auth', authRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/analytics', analyticsRoutes);

app.use('/api/vehicles', vehiclesRoutes);



// Error handling middleware

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({

    success: false,

    error: 'Server Error',

    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',

  });

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {

  console.log(`Error: ${err.message}`);

  // Close server & exit process

  server.close(() => process.exit(1));

});

