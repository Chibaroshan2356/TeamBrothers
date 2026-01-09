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

// Form validation schema
const bookingSchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  customerPhone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  customerEmail: z.string().trim().email('Enter valid email address').max(255, 'Email too long'),
  pickupLocation: z.string().trim().min(3, 'Enter valid pickup location').max(200, 'Location too long'),
  dropLocation: z.string().trim().min(3, 'Enter valid drop location').max(200, 'Location too long'),
  pickupDate: z.string().min(1, 'Select pickup date'),
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

  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState(preselectedVehicleId || '');
  const [tripType, setTripType] = useState<TripType>('family');
  const [passengers, setPassengers] = useState(4);
  const [distance, setDistance] = useState(preselectedDistance);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      bookingSchema.parse({
        customerName,
        customerPhone,
        customerEmail,
        pickupLocation,
        dropLocation,
        pickupDate,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      toast({
        title: "Please select a vehicle",
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

    setIsSubmitting(true);

    try {
      const bookingData = {
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        customerName,
        customerPhone,
        customerEmail,
        tripType,
        passengers,
        pickupLocation,
        dropLocation,
        pickupDate,
        pickupTime,
        distance,
        estimatedCost,
        status: 'pending',
        notes: notes || undefined,
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        setPickupTime('');
        setDistance(0);
        setNotes('');
        setErrors({});
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
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Book Your Ride</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Make an Enquiry
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fill in your trip details and we'll get back to you with availability and final pricing.
          </p>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      placeholder="e.g., Mumbai Central"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                    {errors.pickupLocation && (
                      <p className="text-xs text-destructive">{errors.pickupLocation}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropLocation">Drop Location</Label>
                    <Input
                      id="dropLocation"
                      placeholder="e.g., Lonavala"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                    />
                    {errors.dropLocation && (
                      <p className="text-xs text-destructive">{errors.dropLocation}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      min={minDateStr}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                    {errors.pickupDate && (
                      <p className="text-xs text-destructive">{errors.pickupDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                    {errors.pickupTime && (
                      <p className="text-xs text-destructive">{errors.pickupTime}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
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

                    <div className="pt-4 border-t border-border">
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
                    disabled={!selectedVehicle || isSubmitting}
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
