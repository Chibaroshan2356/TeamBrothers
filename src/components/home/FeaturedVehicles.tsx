import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { useApp } from '@/context/AppContext';

export function FeaturedVehicles() {
  const { vehicles } = useApp();
  
  // Show first 3 available vehicles as featured
  const featuredVehicles = vehicles
    .filter(v => v.available)
    .slice(0, 3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Our most popular picks, ready for your next adventure. All vehicles are regularly serviced and maintained.
            </p>
          </div>
          <Link to="/fleet">
            <Button variant="outline" className="group">
              View All Fleet
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((vehicle, index) => (
            <div 
              key={vehicle.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which vehicle suits you best?
          </p>
          <Link to="/fleet">
            <Button size="lg" variant="default">
              View Our Fleet
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
