import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Fuel, 
  IndianRupee, 
  Settings, 
  Check,
  X,
  Car,
  Star
} from 'lucide-react';
import { Vehicle } from '@/data/vehicles';

interface CompareVehiclesProps {}

export const CompareVehicles: React.FC<CompareVehiclesProps> = () => {
  const navigate = useNavigate();
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Load selected vehicles from localStorage
    const stored = localStorage.getItem('compareVehicles');
    if (stored) {
      try {
        const vehicles = JSON.parse(stored);
        setSelectedVehicles(vehicles);
      } catch (error) {
        console.error('Failed to load compare vehicles:', error);
        setSelectedVehicles([]);
      }
    }
  }, []);

  const removeVehicle = (vehicleId: string) => {
    const updated = selectedVehicles.filter(v => v.id !== vehicleId);
    setSelectedVehicles(updated);
    localStorage.setItem('compareVehicles', JSON.stringify(updated));
  };

  const clearAll = () => {
    setSelectedVehicles([]);
    localStorage.removeItem('compareVehicles');
  };

  const goToBooking = (vehicleId: string) => {
    navigate(`/booking?vehicleId=${vehicleId}`);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'Petrol':
        return <Fuel className="w-4 h-4 text-red-500" />;
      case 'Diesel':
        return <Fuel className="w-4 h-4 text-blue-500" />;
      case 'CNG':
        return <Fuel className="w-4 h-4 text-green-500" />;
      default:
        return <Fuel className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransmissionIcon = (transmission: string) => {
    return transmission === 'Automatic' ? 
      <Settings className="w-4 h-4 text-blue-500" /> : 
      <Settings className="w-4 h-4 text-gray-500" />;
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Check className="w-3 h-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <X className="w-3 h-3 mr-1" />
        Unavailable
      </Badge>
    );
  };

  if (selectedVehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 mb-4">
              <Car className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Vehicle Comparison</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              No Vehicles Selected
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Select up to 3 vehicles from the fleet page to compare their features side by side.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/fleet')} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Browse Fleet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Car className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Vehicle Comparison</span>
            </div>
            
            <Button 
              onClick={() => navigate('/fleet')} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Fleet
            </Button>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Compare Vehicles
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Compare features, specifications, and pricing of your selected vehicles
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => navigate('/fleet')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Add More Vehicles
            </Button>
            
            {selectedVehicles.length > 0 && (
              <Button 
                onClick={clearAll} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {selectedVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(vehicle.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getAvailabilityBadge(vehicle.available)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getRatingStars(4)}
                    <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
                  </div>

                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      ₹{vehicle.baseFare.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground">Base Fare</div>
                  </div>

                  <Button 
                    onClick={() => goToBooking(vehicle.id)}
                    className="w-full"
                  >
                    Book This Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Detailed Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {selectedVehicles.map((vehicle) => (
                      <TableHead key={vehicle.id} className="text-center">
                        <div className="space-y-1">
                          <div className="font-semibold">{vehicle.name}</div>
                          <div className="text-xs text-muted-foreground">{vehicle.type}</div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Capacity */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Seats
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <Badge variant="outline" className="font-medium">
                          {vehicle.capacity} Passengers
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Mileage */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-muted-foreground" />
                        Mileage
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="font-semibold">{vehicle.mileage || 'N/A'} km/l</div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Fuel Type */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-muted-foreground" />
                        Fuel Type
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getFuelIcon(vehicle.fuelType)}
                          <span className="font-medium">{vehicle.fuelType}</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Transmission */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Transmission
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getTransmissionIcon(vehicle.transmission)}
                          <span className="font-medium">{vehicle.transmission}</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Price per Day */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        Price per Day
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="font-bold text-primary">
                          ₹{vehicle.baseFare.toLocaleString('en-IN')}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Price per Km */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        Price per Km
                      </div>
                    </TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="font-semibold">
                          ₹{vehicle.pricePerKm}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Features */}
                  <TableRow>
                    <TableCell className="font-medium">Key Features</TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="space-y-1">
                          {vehicle.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                              {feature}
                            </Badge>
                          ))}
                          {vehicle.features.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{vehicle.features.length - 3} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Suitable For */}
                  <TableRow>
                    <TableCell className="font-medium">Best For</TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        <div className="space-y-1">
                          {vehicle.suitableFor.map((trip, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                              {trip}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Availability */}
                  <TableRow>
                    <TableCell className="font-medium">Availability</TableCell>
                    {selectedVehicles.map((vehicle) => (
                      <TableCell key={vehicle.id} className="text-center">
                        {getAvailabilityBadge(vehicle.available)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate('/fleet')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fleet
          </Button>
          
          <Button 
            onClick={() => navigate('/booking')} 
            className="flex items-center gap-2"
          >
            Book a Vehicle
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareVehicles;
