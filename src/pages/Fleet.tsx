import { useState, useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { VehicleCard } from '@/components/vehicles/VehicleCard';

import { useApp } from '@/context/AppContext';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { 

  Search, 

  Car, 

  X, 

  SlidersHorizontal,

  Grid3x3,

  List,

  Sparkles,

  ArrowUpDown,

  Send

} from 'lucide-react';
import { Link } from 'react-router-dom';

import { TripType, tripTypeLabels } from '@/data/vehicles';

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";



type ViewMode = 'grid' | 'list';

type SortOption = 'name' | 'capacity' | 'price-low' | 'price-high';



const Fleet = () => {

  const { vehicles } = useApp();

  const [searchParams] = useSearchParams();

  

  // State

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');

  const [selectedTripType, setSelectedTripType] = useState<TripType | 'all'>(

    (searchParams.get('tripType') as TripType) || 'all'

  );

  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [sortBy, setSortBy] = useState<SortOption>('name');

  const [showFilters, setShowFilters] = useState(true);



  // Capacity options

  const capacityOptions = [

    { value: 'all', label: 'All Capacities' },

    { value: '1-4', label: '1-4 Passengers' },

    { value: '5-7', label: '5-7 Passengers' },

    { value: '8-14', label: '8-14 Passengers' },

    { value: '15+', label: '15+ Passengers' },

  ];



  // Filter and sort logic

  const filteredAndSortedVehicles = useMemo(() => {

    let filtered = vehicles.filter(vehicle => {

      // Search filter

      if (searchTerm && !vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())) {

        return false;

      }

      

      // Capacity filter

      if (selectedCapacity !== 'all') {

        const capacity = vehicle.capacity;

        if (selectedCapacity === '1-4' && (capacity < 1 || capacity > 4)) return false;

        if (selectedCapacity === '5-7' && (capacity < 5 || capacity > 7)) return false;

        if (selectedCapacity === '8-14' && (capacity < 8 || capacity > 14)) return false;

        if (selectedCapacity === '15+' && capacity < 15) return false;

      }

      

      // Trip type filter

      if (selectedTripType !== 'all' && !vehicle.suitableFor.includes(selectedTripType)) {

        return false;

      }

      

      // Availability filter

      if (showAvailableOnly && !vehicle.available) {

        return false;

      }

      

      return true;

    });



    // Sort

    filtered.sort((a, b) => {

      switch (sortBy) {

        case 'name':

          return a.name.localeCompare(b.name);

        case 'capacity':

          return b.capacity - a.capacity;

        case 'price-low':

          return a.pricePerKm - b.pricePerKm;

        case 'price-high':

          return b.pricePerKm - a.pricePerKm;

        default:

          return 0;

      }

    });



    return filtered;

  }, [vehicles, searchTerm, selectedCapacity, selectedTripType, showAvailableOnly, sortBy]);



  const clearFilters = () => {

    setSearchTerm('');

    setSelectedCapacity('all');

    setSelectedTripType('all');

    setShowAvailableOnly(false);

    setSortBy('name');

  };



  const activeFiltersCount = [

    searchTerm !== '',

    selectedCapacity !== 'all',

    selectedTripType !== 'all',

    showAvailableOnly,

  ].filter(Boolean).length;



  return (

    <div className="min-h-screen bg-background">

      {/* Hero Section */}

      <div className="gradient-hero relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16">

          <div className="max-w-4xl mx-auto text-center">

            <Link to="/booking" className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-5 py-2 mb-6 animate-fade-in hover:bg-secondary/25 transition">
              <Send className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground font-semibold text-sm">Plan Your Trip</span>
            </Link>

            

            <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary-foreground mb-4 animate-slide-up">
              Our <span className="text-gradient">Fleet</span>
            </h1>

            

            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Choose from our carefully curated selection of premium vehicles, perfect for every journey and occasion.
            </p>



            {/* Quick Stats */}

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">

              <div className="bg-card/20 backdrop-blur rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/40 transition-colors">
                <div className="text-3xl font-bold text-primary-foreground">{vehicles.length}</div>
                <div className="text-sm text-primary-foreground/70">Vehicles</div>
              </div>

              <div className="bg-card/20 backdrop-blur rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/40 transition-colors">
                <div className="text-3xl font-bold text-primary-foreground">
                  {vehicles.filter(v => v.available).length}
                </div>
                <div className="text-sm text-primary-foreground/70">Available</div>
              </div>

              <div className="bg-card/20 backdrop-blur rounded-xl p-4 border border-primary-foreground/20 hover:border-primary-foreground/40 transition-colors">
                <div className="text-3xl font-bold text-primary-foreground">
                  {Math.max(...vehicles.map(v => v.capacity))}
                </div>
                <div className="text-sm text-primary-foreground/70">Max Capacity</div>
              </div>

            </div>

          </div>

        </div>

      </div>



      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="hsl(var(--background))"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Controls Bar */}

        <div className="bg-card rounded-2xl border border-primary/20 shadow-sm p-4 mb-6">

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

            {/* Left: Search and Filters Toggle */}

            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">

              {/* Search */}

              <div className="relative flex-1 min-w-[200px]">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />

                <Input

                  placeholder="Search vehicles..."

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)}

                  className="pl-10 h-10 border-primary/20 focus:border-primary"

                />

              </div>



              {/* Filters Toggle */}

              <Button

                variant={showFilters ? "default" : "outline"}

                onClick={() => setShowFilters(!showFilters)}

                className="relative"

              >

                <SlidersHorizontal className="w-4 h-4 mr-2" />

                Filters

                {activeFiltersCount > 0 && (

                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary-foreground text-primary">

                    {activeFiltersCount}

                  </Badge>

                )}

              </Button>

            </div>



            {/* Right: Sort and View Mode */}

            <div className="flex gap-3 items-center w-full lg:w-auto">

              {/* Sort */}

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>

                <SelectTrigger className="w-[180px] h-10 border-primary/20 focus:border-primary">

                  <ArrowUpDown className="w-4 h-4 mr-2 text-primary" />

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="name">Name (A-Z)</SelectItem>

                  <SelectItem value="capacity">Capacity (High-Low)</SelectItem>

                  <SelectItem value="price-low">Price (Low-High)</SelectItem>

                  <SelectItem value="price-high">Price (High-Low)</SelectItem>

                </SelectContent>

              </Select>



              {/* View Mode */}

              <div className="flex gap-1 bg-primary/10 rounded-lg p-1">

                <Button

                  variant={viewMode === 'grid' ? 'default' : 'ghost'}

                  size="sm"

                  onClick={() => setViewMode('grid')}

                  className="h-8 w-8 p-0"

                >

                  <Grid3x3 className="w-4 h-4" />

                </Button>

                <Button

                  variant={viewMode === 'list' ? 'default' : 'ghost'}

                  size="sm"

                  onClick={() => setViewMode('list')}

                  className="h-8 w-8 p-0"

                >

                  <List className="w-4 h-4" />

                </Button>

              </div>

            </div>

          </div>



          {/* Filters Panel */}

          {showFilters && (

            <div className="mt-4 pt-4 border-t border-primary/20">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Capacity Filter */}

                <div className="space-y-2">

                  <Label className="text-xs font-semibold text-primary uppercase">

                    Capacity

                  </Label>

                  <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>

                    <SelectTrigger className="border-primary/20 focus:border-primary">

                      <SelectValue />

                    </SelectTrigger>

                    <SelectContent>

                      {capacityOptions.map(option => (

                        <SelectItem key={option.value} value={option.value}>

                          {option.label}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                </div>



                {/* Trip Type Filter */}

                <div className="space-y-2">

                  <Label className="text-xs font-semibold text-primary uppercase">

                    Trip Type

                  </Label>

                  <Select 

                    value={selectedTripType} 

                    onValueChange={(value) => setSelectedTripType(value as TripType | 'all')}

                  >

                    <SelectTrigger className="border-primary/20 focus:border-primary">

                      <SelectValue />

                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="all">All Types</SelectItem>

                      {(Object.keys(tripTypeLabels) as TripType[]).map(type => (

                        <SelectItem key={type} value={type}>

                          {tripTypeLabels[type]}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                </div>



                {/* Availability Filter */}

                <div className="space-y-2">

                  <Label className="text-xs font-semibold text-primary uppercase">

                    Availability

                  </Label>

                  <div className="flex items-center h-10 px-3 border border-primary/20 rounded-md bg-background">

                    <input

                      type="checkbox"

                      id="available"

                      checked={showAvailableOnly}

                      onChange={(e) => setShowAvailableOnly(e.target.checked)}

                      className="rounded border-primary mr-2 text-primary focus:ring-primary"

                    />

                    <Label htmlFor="available" className="cursor-pointer text-sm">

                      Available only

                    </Label>

                  </div>

                </div>



                {/* Clear Filters */}

                <div className="space-y-2">

                  <Label className="text-xs font-semibold text-muted-foreground uppercase opacity-0">

                    Actions

                  </Label>

                  <Button

                    variant="outline"

                    onClick={clearFilters}

                    disabled={activeFiltersCount === 0}

                    className="w-full h-10 border-primary/20 hover:border-primary hover:bg-primary/10"

                  >

                    <X className="w-4 h-4 mr-2" />

                    Clear All

                  </Button>

                </div>

              </div>

            </div>

          )}

        </div>



        {/* Results Info */}

        <div className="flex items-center justify-between mb-6">

          <div className="text-sm text-muted-foreground">

            Showing <span className="font-semibold text-primary">{filteredAndSortedVehicles.length}</span> of{' '}

            <span className="font-semibold text-primary">{vehicles.length}</span> vehicles

          </div>

          

          {activeFiltersCount > 0 && (

            <div className="flex gap-2 flex-wrap">

              {searchTerm && (

                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">

                  Search: {searchTerm}

                  <X 

                    className="w-3 h-3 cursor-pointer hover:text-primary/70" 

                    onClick={() => setSearchTerm('')}

                  />

                </Badge>

              )}

              {selectedCapacity !== 'all' && (

                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">

                  {capacityOptions.find(o => o.value === selectedCapacity)?.label}

                  <X 

                    className="w-3 h-3 cursor-pointer hover:text-primary/70" 

                    onClick={() => setSelectedCapacity('all')}

                  />

                </Badge>

              )}

              {selectedTripType !== 'all' && (

                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">

                  {tripTypeLabels[selectedTripType]}

                  <X 

                    className="w-3 h-3 cursor-pointer hover:text-primary/70" 

                    onClick={() => setSelectedTripType('all')}

                  />

                </Badge>

              )}

              {showAvailableOnly && (

                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">

                  Available only

                  <X 

                    className="w-3 h-3 cursor-pointer hover:text-primary/70" 

                    onClick={() => setShowAvailableOnly(false)}

                  />

                </Badge>

              )}

            </div>

          )}

        </div>



        {/* Vehicle Grid/List */}

        {filteredAndSortedVehicles.length > 0 ? (

          <div className={

            viewMode === 'grid'

              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'

              : 'flex flex-col gap-4'

          }>

            {filteredAndSortedVehicles.map((vehicle, index) => (

              <div

                key={vehicle.id}

                className="animate-fade-in"

                style={{ animationDelay: `${index * 0.05}s` }}

              >

                <VehicleCard 

                  vehicle={vehicle}

                  viewMode={viewMode}

                />

              </div>

            ))}

          </div>

        ) : (

          <div className="text-center py-20 bg-card rounded-2xl border border-primary/20">

            <div className="max-w-md mx-auto">

              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">

                <Car className="w-10 h-10 text-primary" />

              </div>

              <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">

                No vehicles found

              </h3>

              <p className="text-muted-foreground mb-6">

                We couldn't find any vehicles matching your criteria. 

                Try adjusting your filters.

              </p>

              <Button onClick={clearFilters} variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary/10">

                <X className="w-4 h-4 mr-2" />

                Clear All Filters

              </Button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};



export default Fleet;

