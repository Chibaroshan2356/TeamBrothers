const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
require('dotenv').config();

// Updated vehicle data matching frontend
const vehicles = [
  {
    id: 'swift-dzire',
    name: 'Sabarika (Bulloke)',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 12,
    baseFare: 500,
    features: ['AC', 'Music System', 'GPS', 'First Aid Kit'],
    suitableFor: ['family', 'office'],
    available: true,
    description: 'Comfortable sedan perfect for small families and business trips. Excellent fuel efficiency and smooth ride.',
    fuelType: 'Petrol',
    transmission: 'Manual',
    carbonPerKm: 120,
  },
  {
    id: 'ertiga',
    name: 'CBS (Hunter)',
    type: 'MPV',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 15,
    baseFare: 800,
    features: ['AC', 'Music System', 'GPS', 'First Aid Kit', 'USB Charging'],
    suitableFor: ['family', 'friends'],
    available: true,
    description: 'Spacious 7-seater MPV ideal for family vacations and group outings. Plenty of luggage space.',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    carbonPerKm: 145,
  },
  {
    id: 'innova-crysta',
    name: 'CBS (Chikku Bukku)',
    type: 'Premium MPV',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 20,
    baseFare: 1200,
    features: ['Premium AC', 'Leather Seats', 'GPS', 'First Aid Kit', 'WiFi', 'Entertainment System'],
    suitableFor: ['family', 'office', 'friends'],
    available: true,
    description: 'Premium MPV with exceptional comfort. Perfect for long journeys and corporate travel.',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    carbonPerKm: 165,
  },
  {
    id: 'tempo-traveller-12',
    name: 'Sakthi (Jin)',
    type: 'Mini Bus',
    image: 'https://images.unsplash.com/photo-1578662996442-7f5f0c9d9d6?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 25,
    baseFare: 1500,
    features: ['AC', 'Push-back Seats', 'GPS', 'First Aid Kit', 'Luggage Carrier', 'PA System'],
    suitableFor: ['friends', 'office'],
    available: true,
    description: 'Ideal for medium-sized groups. Great for office outings and friend group adventures.',
    fuelType: 'Diesel',
    transmission: 'Manual',
    carbonPerKm: 200,
  },
  {
    id: 'tempo-traveller-17',
    name: 'PKS',
    type: 'Mini Bus',
    image: 'https://images.unsplash.com/photo-1542362564-b6e643ab4f45?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 30,
    baseFare: 2000,
    features: ['AC', 'Push-back Seats', 'GPS', 'First Aid Kit', 'Luggage Carrier', 'PA System', 'Ice Box'],
    suitableFor: ['friends', 'office'],
    available: false,
    description: 'Large capacity vehicle perfect for bigger groups. Comfortable seating for long journeys.',
    fuelType: 'Diesel',
    transmission: 'Manual',
    carbonPerKm: 220,
  },
  {
    id: 'luxury-bus',
    name: 'Sabarika (Vanamagan)',
    type: 'Coach',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 40,
    baseFare: 3000,
    features: ['Premium AC', 'Recliner Seats', 'GPS', 'First Aid Kit', 'Luggage Storage', 'PA System', 'Entertainment', 'Refreshments'],
    suitableFor: ['office', 'friends'],
    available: true,
    description: 'Premium luxury coach for large corporate events and group tours. Ultimate comfort on wheels.',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    carbonPerKm: 280,
  }
];

async function seedVehicles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/road-trip-advisor');
    
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');
    
    // Insert new vehicles
    await Vehicle.insertMany(vehicles);
    console.log(`Seeded ${vehicles.length} vehicles successfully`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    process.exit(1);
  }
}

// Run the seed function
seedVehicles();
