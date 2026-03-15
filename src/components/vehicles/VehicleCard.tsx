import { Vehicle, calculateTripCost, tripTypeLabels, TripType } from '@/data/vehicles';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Fuel, Settings, Leaf, IndianRupee, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
  showBookButton?: boolean;
  distance?: number;
  onCompare?: (vehicleId: string) => void;
  compareMode?: boolean;
  isSelectedForCompare?: boolean;
  viewMode?: 'grid' | 'list';
}

export function VehicleCard({ 
  vehicle, 
  showBookButton = true, 
  distance, 
  onCompare, 
  compareMode = false, 
  isSelectedForCompare = false,
  viewMode = 'grid'
}: VehicleCardProps) {
  const estimatedCost = distance ? calculateTripCost(vehicle, distance) : null;
  const [compareVehicles, setCompareVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadCompareVehicles = () => {
      const stored = localStorage.getItem("compareVehicles");
      if (stored) {
        try {
          setCompareVehicles(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to load compare vehicles:", error);
        }
      } else {
        setCompareVehicles([]);
      }
    };

    loadCompareVehicles();

    // Listen for localStorage updates
    window.addEventListener("storage", loadCompareVehicles);

    return () => {
      window.removeEventListener("storage", loadCompareVehicles);
    };
  }, []);

  const isInCompare = compareVehicles.some(v => v.id === vehicle.id);
  const canCompare = compareVehicles.length < 3 && !isInCompare;

  const handleCompare = () => {
    let updated: Vehicle[];

    if (isInCompare) {
      updated = compareVehicles.filter(v => v.id !== vehicle.id);
    } else {
      if (compareVehicles.length >= 3) return;
      updated = [...compareVehicles, vehicle];
    }

    setCompareVehicles(updated);
    localStorage.setItem("compareVehicles", JSON.stringify(updated));

    // Force UI update across cards
    window.dispatchEvent(new Event("storage"));
  };

  // Determine if button should be disabled
  const isDisabled = compareMode 
    ? false // Always enabled in compare mode
    : (!canCompare && !isInCompare); // Original logic for normal mode

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
            <img
              src={vehicle.image}
              alt={`${vehicle.name} - ${vehicle.type} rental vehicle`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/60 to-transparent" />
            
            {/* Availability Badge */}
            <Badge
              className={cn(
                "absolute top-3 right-3",
                vehicle.available
                  ? "bg-success text-success-foreground"
                  : "bg-destructive text-destructive-foreground"
              )}
            >
              {vehicle.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {vehicle.name}
                    </h3>
                    <Badge variant="secondary">{vehicle.type}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {vehicle.description}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{vehicle.capacity} Passengers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="w-4 h-4 text-primary" />
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-primary" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="w-4 h-4 text-success" />
                  <span>{vehicle.carbonPerKm}g CO₂/km</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {vehicle.suitableFor.map(type => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {tripTypeLabels[type as TripType]}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                {/* Pricing */}
                <div className="bg-accent/50 rounded-lg p-3 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                  <div className="flex items-center gap-1 font-heading font-bold text-lg text-foreground">
                    <IndianRupee className="w-4 h-4" />
                    <span>{vehicle.baseFare}</span>
                    <span className="text-sm font-normal text-muted-foreground">+ ₹{vehicle.pricePerKm}/km</span>
                  </div>
                </div>

                {/* Actions */}
                {showBookButton && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleCompare}
                      disabled={isDisabled}
                      className={cn(
                        isInCompare && "bg-primary text-primary-foreground hover:bg-primary/90",
                        compareMode && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      {compareMode ? (isSelectedForCompare ? 'Selected' : 'Select') : (isInCompare ? 'Remove' : 'Compare')}
                    </Button>
                    <Link to={`/booking?vehicle=${vehicle.id}`}>
                      <Button 
                        disabled={!vehicle.available}
                        onClick={(e) => {
                          if (!vehicle.available) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {vehicle.available ? 'Book Now' : 'Unavailable'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view layout (original)
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} - ${vehicle.type} rental vehicle`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Availability Badge */}
        <Badge
          className={cn(
            "absolute top-3 right-3",
            vehicle.available
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {vehicle.available ? 'Available' : 'Unavailable'}
        </Badge>

        {/* Vehicle Type */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
            {vehicle.type}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              {vehicle.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {vehicle.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{vehicle.capacity} Passengers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="w-4 h-4 text-primary" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-primary" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Leaf className="w-4 h-4 text-success" />
            <span>{vehicle.carbonPerKm}g CO₂/km</span>
          </div>
        </div>

        {/* Suitable For Tags */}
        <div className="flex flex-wrap gap-1">
          {vehicle.suitableFor.map(type => (
            <Badge key={type} variant="outline" className="text-xs">
              {tripTypeLabels[type as TripType]}
            </Badge>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-accent/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <div className="flex items-center gap-1 font-heading font-bold text-lg text-foreground">
                <IndianRupee className="w-4 h-4" />
                <span>{vehicle.baseFare}</span>
                <span className="text-sm font-normal text-muted-foreground">+ ₹{vehicle.pricePerKm}/km</span>
              </div>
            </div>
            {estimatedCost && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Est. for {distance}km</p>
                <div className="flex items-center gap-1 font-heading font-bold text-primary">
                  <IndianRupee className="w-4 h-4" />
                  <span>{estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {showBookButton && (
        <CardFooter className="pt-0 mt-auto">

          {!isInCompare ? (

            /* Normal Card */
            <div className="flex w-full gap-3">

              <Button
                variant="outline"
                size="sm"
                onClick={handleCompare}
                disabled={compareVehicles.length >= 3}
                className="flex-1"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
              </Button>

              <Link to={`/booking?vehicle=${vehicle.id}`} className="flex-1">
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!vehicle.available}
                >
                  {vehicle.available ? "Book Now" : "Unavailable"}
                </Button>
              </Link>

            </div>

          ) : (

            /* Selected Vehicle */
            <div className="flex w-full gap-2">

              <Link to={`/booking?vehicle=${vehicle.id}`} className="flex-1">
                <Button size="sm" className="w-full">
                  {vehicle.available ? "Book Now" : "Unavailable"}
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCompare}
                className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border-yellow-400"
              >
                <GitCompare className="w-4 h-4 mr-1" />
                Cancel
              </Button>

              <Button
                variant="secondary"
                size="sm"
                disabled={compareVehicles.length < 2}
                onClick={() => window.location.href = "/compare-vehicles"}
              >
                <GitCompare className="w-4 h-4 mr-1" />
                {compareVehicles.length}
              </Button>

            </div>

          )}

        </CardFooter>
      )}
    </Card>
  );
}
