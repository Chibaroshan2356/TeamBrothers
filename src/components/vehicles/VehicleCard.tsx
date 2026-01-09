import { Vehicle, calculateTripCost, tripTypeLabels, TripType } from '@/data/vehicles';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Fuel, Settings, Leaf, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  showBookButton?: boolean;
  distance?: number;
}

export function VehicleCard({ vehicle, showBookButton = true, distance }: VehicleCardProps) {
  const estimatedCost = distance ? calculateTripCost(vehicle, distance) : null;

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
        <CardFooter className="pt-0">
          <Link to={`/booking?vehicle=${vehicle.id}`} className="w-full">
            <Button 
              className="w-full" 
              disabled={!vehicle.available}
            >
              {vehicle.available ? 'Book Now' : 'Currently Unavailable'}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
