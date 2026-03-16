import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Info, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import AnalogTimePicker from '@/components/ui/AnalogTimePicker';

interface TripDetailsSectionProps {
  onSearchVehicles: (tripData: TripData) => void;
}

interface TripData {
  pickupLocation: string;
  dropLocation: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
}

const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({ onSearchVehicles }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  
  // Mock booked dates for demonstration - set to empty array
  const bookedDates: Date[] = [];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booked => 
      date.getDate() === booked.getDate() &&
      date.getMonth() === booked.getMonth() &&
      date.getFullYear() === booked.getFullYear()
    );
  };

  const isStartDate = (date: Date) => {
    if (!pickupDate) return false;
    return date.getDate() === pickupDate.getDate() &&
           date.getMonth() === pickupDate.getMonth() &&
           date.getFullYear() === pickupDate.getFullYear();
  };

  const isEndDate = (date: Date) => {
    if (!returnDate) return false;
    return date.getDate() === returnDate.getDate() &&
           date.getMonth() === returnDate.getMonth() &&
           date.getFullYear() === returnDate.getFullYear();
  };

  const isDateInRange = (date: Date) => {
    if (!pickupDate || !returnDate) return false;
    return date > pickupDate && date < returnDate;
  };

  const isPreviewRange = (date: Date) => {
    if (!pickupDate || returnDate || !hoverDate) return false;
    return date > pickupDate && date <= hoverDate;
  };

  const isDateHovered = (date: Date) => {
    // Add hover state for better UX
    return false; // This can be enhanced later
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return;
    
    if (!pickupDate) {
      // Step 1: Set start date
      setPickupDate(date);
      setReturnDate(null);
    } else if (!returnDate) {
      // Step 2: Set end date - prevent backward selection
      if (date < pickupDate) {
        // User clicked earlier date - reset start date
        setPickupDate(date);
        setReturnDate(null);
      } else {
        setReturnDate(date);
      }
    } else {
      // Step 3: Reset and start new selection
      setPickupDate(date);
      setReturnDate(null);
    }
  };

  const clearDates = () => {
    setPickupDate(null);
    setReturnDate(null);
    setHoverDate(null);
  };

  const isSingleDayTrip = pickupDate && !returnDate;
  
  const calculateDuration = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate) return 0;
    
    const end = endDate || startDate;
    const diff = Math.ceil((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  const getDisplayText = () => {
    if (returnDate) {
      // Multi-day trip
      return `${formatDate(pickupDate)} → ${formatDate(returnDate)}`;
    } else if (pickupDate) {
      // Single day trip
      return `${formatDate(pickupDate)} • 1 Day`;
    }
    return '';
  };

  // Auto-send trip data when all fields are filled
  React.useEffect(() => {
    if (pickupLocation && dropLocation && pickupDate && pickupTime) {
      // For single day trips, set return date to pickup date
      const finalReturnDate = returnDate || pickupDate;

      const tripData: TripData = {
        pickupLocation,
        dropLocation,
        pickupDate,
        returnDate: finalReturnDate,
        pickupTime,
      };

      onSearchVehicles(tripData);
    }
  }, [pickupLocation, dropLocation, pickupDate, returnDate, pickupTime, onSearchVehicles]);

  const handleSearch = () => {
    if (!pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
      alert('Please fill in all trip details');
      return;
    }

    // For single day trips, set return date to pickup date
    const finalReturnDate = returnDate || pickupDate;

    const tripData: TripData = {
      pickupLocation,
      dropLocation,
      pickupDate,
      returnDate: finalReturnDate,
      pickupTime,
    };

    onSearchVehicles(tripData);
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return 'Select time';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const handleTimeSelect = (time: string) => {
    console.log('Time selected:', time); // Debug log
    setPickupTime(time);
    setIsTimeModalOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Trip Details</h1>
          <p className="text-gray-600">Plan your journey with our premium vehicles</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Card */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="From: Mumbai Central"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="pl-10 h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="To: Lonavala"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="pl-10 h-11 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Dates</h3>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h4 className="text-base font-medium text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`day-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <div key={index} className="aspect-square">
                      {date && (
                        <button
                          onClick={() => handleDateClick(date)}
                          onMouseEnter={() => {
                            if (pickupDate && !returnDate) {
                              setHoverDate(date);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoverDate(null);
                          }}
                          className={cn(
                            "w-full h-full rounded text-sm font-medium transition-all duration-200",
                            {
                              "bg-red-100 text-red-600 cursor-not-allowed hover:bg-red-200": isDateBooked(date),
                              "bg-blue-600 text-white hover:bg-blue-700 shadow-md": isStartDate(date) || isEndDate(date),
                              "bg-blue-200 text-blue-800 hover:bg-blue-300": isDateInRange(date) || isPreviewRange(date),
                              "text-gray-900 hover:bg-blue-100 hover:text-blue-900 hover:shadow-sm": !isDateBooked(date) && !isStartDate(date) && !isEndDate(date) && !isDateInRange(date) && !isPreviewRange(date),
                            }
                          )}
                          disabled={isDateBooked(date)}
                        >
                          {date.getDate()}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Dates Display */}
                {pickupDate && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {getDisplayText()}
                      </span>
                    </div>
                    <button
                      onClick={clearDates}
                      className="text-green-700 hover:bg-green-200 rounded-full p-1 transition-colors"
                      title="Clear dates"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Instruction for selecting return date */}
                {isSingleDayTrip && (
                  <div className="mt-2 text-xs text-blue-700">
                    <p>Hover over other dates to preview a multi-day trip, or click the same date to keep it as a single day</p>
                  </div>
                )}

                {/* Info Notes */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-100 rounded-full"></div>
                    <span>Booked dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
                    <span>Selected dates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Card */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Time</h3>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => setIsTimeModalOpen(true)}
                    className="w-full pl-10 pr-8 h-11 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {formatTimeDisplay(pickupTime)}
                  </button>
                  <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-270 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Action */}
          <div className="space-y-6">
            {/* Trip Summary Card */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium text-gray-900">
                      {pickupLocation || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium text-gray-900">
                      {dropLocation || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {(() => { 
                        const duration = calculateDuration(pickupDate, returnDate);
                        return duration > 0 ? `${duration} ${duration === 1 ? 'day' : 'days'}` : 'Not selected';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">
                      {formatTimeDisplay(pickupTime)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Time Picker Modal */}
      <AnalogTimePicker
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onTimeSelect={handleTimeSelect}
        initialTime={pickupTime}
      />
    </div>
  );
};

export default TripDetailsSection;
