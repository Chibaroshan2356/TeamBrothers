import { useState } from 'react';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Users, Car } from 'lucide-react';
import { TripType, tripTypeLabels } from '@/data/vehicles';

/**
 * Fleet Page Component
 * 
 * Displays all 6 vehicles with filtering options:
 * - Search by name
 * - Filter by capacity
 * - Filter by trip type
 * - Show availability status
 */
const Fleet = () => {
  const { vehicles } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [minCapacity, setMinCapacity] = useState(1);
  const [selectedTripTypes, setSelectedTripTypes] = useState<TripType[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Filter logic
  const filteredVehicles = vehicles.filter(vehicle => {
    // Search filter
    if (searchTerm && !vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Capacity filter
    if (vehicle.capacity < minCapacity) {
      return false;
    }
    // Trip type filter
    if (selectedTripTypes.length > 0 && !selectedTripTypes.some(t => vehicle.suitableFor.includes(t))) {
      return false;
    }
    // Availability filter
    if (showAvailableOnly && !vehicle.available) {
      return false;
    }
    return true;
  });

  const toggleTripType = (type: TripType) => {
    setSelectedTripTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Car className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Our Fleet</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Ride
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our complete fleet of 6 vehicles. Each one is carefully maintained and ready for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold">Filters</h2>
              </div>

              {/* Search */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Capacity Slider */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <Label>Min. Capacity</Label>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    <Users className="w-4 h-4" />
                    {minCapacity}+
                  </span>
                </div>
                <Slider
                  value={[minCapacity]}
                  onValueChange={([value]) => setMinCapacity(value)}
                  min={1}
                  max={25}
                  step={1}
                />
              </div>

              {/* Trip Type */}
              <div className="space-y-3 mb-6">
                <Label>Trip Type</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(tripTypeLabels) as TripType[]).map(type => (
                    <Badge
                      key={type}
                      variant={selectedTripTypes.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTripType(type)}
                    >
                      {tripTypeLabels[type]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="available" className="cursor-pointer">
                  Available only
                </Label>
              </div>

              {/* Results Count */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of {vehicles.length} vehicles
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Car className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  No vehicles found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
