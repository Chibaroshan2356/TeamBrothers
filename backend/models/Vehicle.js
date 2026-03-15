const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  pricePerKm: {
    type: Number,
    required: true
  },
  baseFare: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  suitableFor: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: true
  },
  carbonPerKm: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
