import React from 'react';
import TripDetailsSection from '@/components/booking/TripDetailsSection';

interface TripData {
  pickupLocation: string;
  dropLocation: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
}

const TripDetailsPage: React.FC = () => {
  const handleSearchVehicles = (tripData: TripData) => {
    console.log('Trip Details:', tripData);
    // Here you would typically navigate to vehicle selection page
    // or show available vehicles based on the trip data
    alert('Trip details captured! Check console for data.');
  };

  return (
    <div>
      <TripDetailsSection onSearchVehicles={handleSearchVehicles} />
    </div>
  );
};

export default TripDetailsPage;
