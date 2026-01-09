const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    vehicleId: {
      type: String,
      required: [true, 'Vehicle ID is required'],
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    tripType: {
      type: String,
      required: [true, 'Trip type is required'],
      enum: ['family', 'friends', 'office'],
    },
    passengers: {
      type: Number,
      required: [true, 'Number of passengers is required'],
      min: [1, 'At least 1 passenger is required'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
    },
    pickupDate: {
      type: String,
      required: [true, 'Pickup date is required'],
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required'],
    },
    distance: {
      type: Number,
      required: [true, 'Distance is required'],
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Estimated cost is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.bookingId = `BK${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
