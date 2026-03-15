// Vehicle data for the rental fleet
// This simulates a database for the college project

export type TripType = 'family' | 'friends' | 'office';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  capacity: number;
  pricePerKm: number;
  baseFare: number;
  features: string[];
  suitableFor: TripType[];
  available: boolean;
  description: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  carbonPerKm: number; // grams of CO2 per km
}

export const vehicles: Vehicle[] = [
  {
    id: 'swift-dzire',
    name: 'Sabarika (Bulloke)',
    type: 'Bus',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 12,
    baseFare: 500,
    features: ['AC', 'Music System', 'GPS', 'First Aid Kit'],
    suitableFor: ['family', 'office'],
    available: true,
    description: 'Comfortable bus perfect for small families and business trips. Excellent fuel efficiency and smooth ride.',
    fuelType: 'Petrol',
    transmission: 'Manual',
    carbonPerKm: 120,
  },
  {
    id: 'ertiga',
    name: 'CBS (Hunter)',
    type: 'Bus',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 15,
    baseFare: 800,
    features: ['AC', 'Music System', 'GPS', 'First Aid Kit', 'USB Charging'],
    suitableFor: ['family', 'friends'],
    available: true,
    description: 'Spacious bus ideal for family vacations and group outings. Plenty of luggage space.',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    carbonPerKm: 145,
  },
  {
    id: 'innova-crysta',
    name: 'CBS (Chikku Bukku)',
    type: 'Bus',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 20,
    baseFare: 1200,
    features: ['Premium AC', 'Leather Seats', 'GPS', 'First Aid Kit', 'WiFi', 'Entertainment System'],
    suitableFor: ['family', 'office', 'friends'],
    available: true,
    description: 'Premium bus with exceptional comfort. Perfect for long journeys and corporate travel.',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    carbonPerKm: 165,
  },
  {
    id: 'tempo-traveller-12',
    name: 'Sakthi (Jin)',
    type: 'Bus',
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
    type: 'Bus',
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
    type: 'Bus',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop',
    capacity: 54,
    pricePerKm: 40,
    baseFare: 3000,
    features: ['Premium AC', 'Recliner Seats', 'GPS', 'First Aid Kit', 'Luggage Storage', 'PA System', 'Entertainment', 'Refreshments'],
    suitableFor: ['office', 'friends'],
    available: true,
    description: 'Premium luxury bus for large corporate events and group tours. Ultimate comfort on wheels.',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    carbonPerKm: 280,
  },
];

// Booking/Enquiry types
export type BookingStatus = 'pending' | 'approved' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tripType: TripType;
  passengers: number;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  distance: number;
  estimatedCost: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

// Helper functions for recommendation logic
export function calculateTripCost(vehicle: Vehicle, distance: number): number {
  return vehicle.baseFare + (vehicle.pricePerKm * distance);
}

export function recommendVehicle(
  passengers: number,
  tripType: TripType,
  distance: number
): { vehicle: Vehicle; score: number; reasons: string[] }[] {
  const recommendations = vehicles
    .filter(v => v.available && v.capacity >= passengers)
    .map(vehicle => {
      let score = 100;
      const reasons: string[] = [];

      // Capacity efficiency - prefer vehicles that aren't too oversized
      const capacityRatio = passengers / vehicle.capacity;
      if (capacityRatio >= 0.7) {
        score += 20;
        reasons.push('Optimal seating capacity utilization');
      } else if (capacityRatio >= 0.5) {
        score += 10;
        reasons.push('Good capacity match');
      } else {
        score -= 10;
        reasons.push('Vehicle may be larger than needed');
      }

      // Trip type suitability
      if (vehicle.suitableFor.includes(tripType)) {
        score += 25;
        reasons.push(`Specifically designed for ${tripType} trips`);
      }

      // Distance optimization
      if (distance > 200) {
        // For long trips, prefer comfortable vehicles
        if (vehicle.type.includes('Premium') || vehicle.type === 'Coach') {
          score += 15;
          reasons.push('Premium comfort for long journey');
        }
        // Diesel is more economical for long distances
        if (vehicle.fuelType === 'Diesel') {
          score += 10;
          reasons.push('Fuel efficient for long distance');
        }
      } else if (distance < 50) {
        // For short trips, prefer economical vehicles
        if (vehicle.pricePerKm <= 15) {
          score += 15;
          reasons.push('Cost-effective for short trips');
        }
      }

      // Cost efficiency
      const costPerPerson = calculateTripCost(vehicle, distance) / passengers;
      if (costPerPerson < 500) {
        score += 10;
        reasons.push('Excellent value per person');
      }

      // Carbon footprint consideration
      if (vehicle.carbonPerKm < 150) {
        score += 5;
        reasons.push('Lower environmental impact');
      }

      return { vehicle, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  return recommendations;
}

// Trip type display names
export const tripTypeLabels: Record<TripType, string> = {
  family: 'Family Trip',
  friends: 'Friends Outing',
  office: 'Office/Corporate',
};
