import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Phone, Mail, User, IndianRupee, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { TripType, tripTypeLabels, calculateTripCost } from '@/data/vehicles';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import VehicleAvailabilityCalendar from '@/components/vehicles/VehicleAvailabilityCalendar';
import TripDetailsSection from '@/components/booking/TripDetailsSection';

interface TripData {
  pickupLocation: string;
  dropLocation: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
}

// Form validation schema
const bookingSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  customerPhone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  customerEmail: z.string().trim().email('Enter valid email address').max(255, 'Email too long'),
  pickupLocation: z.string().trim().min(3, 'Enter valid pickup location').max(200, 'Location too long'),
  dropLocation: z.string().trim().min(3, 'Enter valid drop location').max(200, 'Location too long'),
  pickupDate: z.date({ required_error: 'Select pickup date' }),
  returnDate: z.date({ required_error: 'Select return date' }),
  pickupTime: z.string().min(1, 'Select pickup time'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

/**
 * Booking Page Component
 * 
 * Features:
 * - Real-time cost estimation based on distance
 * - Form validation with Zod
 * - Submits enquiry to context (simulates API)
 * - Redirects to WhatsApp with auto-filled message
 */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { vehicles, addBooking } = useApp();
  const { toast } = useToast();

  // Get pre-selected vehicle from URL
  const preselectedVehicleId = searchParams.get('vehicle');
  const preselectedDistance = Number(searchParams.get('distance')) || 100;

  // State for trip details
  const [tripData, setTripData] = useState<TripData | null>(null);

  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState(preselectedVehicleId || '');
  const [tripType, setTripType] = useState<TripType>('family');
  const [distance, setDistance] = useState(preselectedDistance);
  const [passengers, setPassengers] = useState(4);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Handle trip data from TripDetailsSection
  const handleTripData = (data: TripData) => {
    setTripData(data);
    // Update form state with trip data
    setPickupLocation(data.pickupLocation);
    setDropLocation(data.dropLocation);
    setPickupDate(data.pickupDate.toISOString().split('T')[0]);
    setReturnDate(data.returnDate.toISOString().split('T')[0]);
    setPickupTime(data.pickupTime);
  };

  // Selected vehicle
  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  // Cost estimation
  const estimatedCost = useMemo(() => 
    selectedVehicle ? calculateTripCost(selectedVehicle, distance) : 0,
    [selectedVehicle, distance]
  );

  // Available vehicles only
  const availableVehicles = vehicles.filter(v => v.available);

  // Min date for booking (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const validateForm = () => {
    try {
      // For single day trips, use pickupDate as returnDate for validation
      const finalReturnDate = returnDate || pickupDate;
      
      bookingSchema.parse({
        customerName,
        customerPhone,
        customerEmail,
        pickupLocation,
        dropLocation,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(finalReturnDate),
        pickupTime,
        notes,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const checkAvailability = async (pickup: Date, returnD: Date) => {
    if (!selectedVehicle) return;

    try {
      console.log('Checking availability for:', {
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        pickup: pickup.toISOString(),
        return: returnD.toISOString()
      });

      const response = await fetch(
        `https://teambrothers.onrender.com/api/bookings/availability?vehicleId=${selectedVehicle.id}&pickupDate=${pickup.toISOString()}&returnDate=${returnD.toISOString()}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Availability response:', data);

      if (!data.success) {
        setAvailabilityError(data.message || 'Vehicle is not available for the selected dates');
        return false;
      } else if (!data.isAvailable) {
        setAvailabilityError('Vehicle is not available for the selected dates');
        return false;
      } else {
        setAvailabilityError(null);
        return true;
      }
    } catch (error) {
      console.error('Availability check error:', error);
      // If backend is not available, assume vehicle is available
      if (error instanceof Error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('ECONNREFUSED')
      )) {
        console.log('Backend not available, assuming vehicle is available');
        setAvailabilityError(null);
        return true;
      }
      setAvailabilityError('Error checking availability. Please try again.');
      return false;
    }
  };

  const handleDateSelect = async (pickup: Date, returnD: Date) => {
    setPickupDate(pickup.toISOString().split('T')[0]);
    setReturnDate(returnD.toISOString().split('T')[0]);
    
    if (selectedVehicle) {
      await checkAvailability(pickup, returnD);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use tripData directly if form state is empty
    const finalPickupLocation = pickupLocation || tripData?.pickupLocation || '';
    const finalDropLocation = dropLocation || tripData?.dropLocation || '';
    const finalPickupDate = pickupDate || tripData?.pickupDate?.toISOString().split('T')[0] || '';
    const finalReturnDate = returnDate || tripData?.returnDate?.toISOString().split('T')[0] || '';
    const finalPickupTime = pickupTime || tripData?.pickupTime || '';
    const finalCustomerName = customerName || '';
    const finalCustomerPhone = customerPhone || '';
    const finalCustomerEmail = customerEmail || '';
    
    // Check if basic trip details are filled
    if (!finalPickupLocation || !finalDropLocation || !finalPickupDate || !finalPickupTime) {
      toast({
        title: "Please complete trip details",
        description: "Fill in pickup, drop location, date and time",
        variant: "destructive",
      });
      return;
    }

    if (!finalCustomerName || !finalCustomerPhone) {
      toast({
        title: "Please fill customer details",
        description: "Name and phone are required",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors",
        variant: "destructive",
      });
      return;
    }

    if (availabilityError) {
      toast({
        title: "Vehicle not available",
        description: availabilityError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        vehicleId: selectedVehicle?.id || null,
        vehicleName: selectedVehicle?.name || 'Not specified',
        customerName,
        customerPhone,
        customerEmail,
        tripType,
        passengers,
        pickupLocation,
        dropLocation,
        pickupDate,
        returnDate,
        pickupTime,
        distance,
        estimatedCost,
        status: 'pending',
        notes: notes || undefined,
      };

      const response = await fetch('https://teambrothers.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        setIsSubmitted(true);

        toast({
          title: "Enquiry Submitted!",
          description: `Booking ID: ${result.data.bookingId}. We'll contact you soon.`,
        });

        // Reset form
        setSelectedVehicleId('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setTripType('family');
        setPassengers(1);
        setPickupLocation('');
        setDropLocation('');
        setPickupDate('');
        setReturnDate('');
        setPickupTime('');
        setDistance(0);
        setNotes('');
        setErrors({});
        setAvailabilityError(null);

        // Show success message and refresh page
        toast({
          title: "Success!",
          description: "Your enquiry has been submitted successfully. We'll contact you soon.",
        });
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (!selectedVehicle) return;
    
    const message = encodeURIComponent(
      `Hi TravelEase! I'd like to enquire about:\n\n` +
      `🚗 Vehicle: ${selectedVehicle.name}\n` +
      `👥 Passengers: ${passengers}\n` +
      `📍 From: ${pickupLocation}\n` +
      `📍 To: ${dropLocation}\n` +
      `📅 Date: ${pickupDate}\n` +
      `⏰ Time: ${pickupTime}\n` +
      `📏 Distance: ${distance} km\n` +
      `💰 Est. Cost: ₹${estimatedCost.toLocaleString()}\n\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Email: ${customerEmail}`
    );
    
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Enquiry Submitted!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your booking request. Our team will contact you within 2 hours to confirm availability.
            </p>
            <div className="space-y-3">
              <Button onClick={handleWhatsApp} className="w-full" variant="default">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Send className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground font-semibold text-sm">Book Your Journey</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary-foreground mb-4 animate-slide-up">
              Complete Your <span className="text-gradient">Booking</span>
            </h1>
            
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Fill in your trip details and we'll provide you with the best vehicle options and pricing for your journey.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle</Label>
                    <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} ({v.capacity} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trip Type</Label>
                    <Select value={tripType} onValueChange={(v) => setTripType(v as TripType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(tripTypeLabels) as TripType[]).map(type => (
                          <SelectItem key={type} value={type}>
                            {tripTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min={1}
                      max={selectedVehicle?.capacity || 25}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      min={10}
                      max={2000}
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <TripDetailsSection onSearchVehicles={handleTripData} />

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-destructive">{errors.customerName}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      placeholder="10-digit mobile"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-destructive">{errors.customerPhone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    {errors.customerEmail && (
                      <p className="text-xs text-destructive">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-primary/30">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Cost Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {selectedVehicle ? (
                  <>
                    <div className="flex items-center gap-3 pb-4">
                      <img
                        src={selectedVehicle.image}
                        alt={selectedVehicle.name}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{selectedVehicle.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.type}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Fare</span>
                        <span>₹{selectedVehicle.baseFare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate per km</span>
                        <span>₹{selectedVehicle.pricePerKm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance</span>
                        <span>{distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance Cost</span>
                        <span>₹{(selectedVehicle.pricePerKm * distance).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Estimated Total</span>
                        <span className="font-heading text-2xl font-bold text-primary">
                          ₹{estimatedCost.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        *Final price may vary based on actual distance and tolls
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Select a vehicle to see cost estimate
                  </p>
                )}

                <div className="space-y-3 pt-4">
                  <Button 
  type="submit" 
  className="w-full" 
  size="lg"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>Processing...</>
  ) : (
    <>
      <Send className="w-4 h-4 mr-2" />
      Submit Enquiry
    </>
  )}
</Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleWhatsApp}
                    disabled={!selectedVehicle || !pickupLocation || !dropLocation}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enquire via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
