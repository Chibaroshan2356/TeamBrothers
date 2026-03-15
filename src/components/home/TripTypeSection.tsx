import { Link } from 'react-router-dom';
import { Heart, Users, Briefcase, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TripType } from '@/data/vehicles';

const tripTypes: {
  type: TripType;
  icon: typeof Heart;
  title: string;
  description: string;
  image: string;
  color: string;
}[] = [
  {
    type: 'family',
    icon: Heart,
    title: 'Family Trips',
    description: 'Comfortable vehicles with ample space for luggage and kids. Safety is our priority.',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop',
    color: 'bg-rose-500',
  },
  {
    type: 'friends',
    icon: Users,
    title: 'Friends Outing',
    description: 'Fun group adventures with spacious seating. Perfect for weekend getaways and road trips.',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&auto=format&fit=crop',
    color: 'bg-amber-500',
  },
  {
    type: 'office',
    icon: Briefcase,
    title: 'Office/Corporate',
    description: 'Professional vehicles for business meetings, team outings, and corporate events.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop',
    color: 'bg-blue-500',
  },
];

export function TripTypeSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            What's Your Trip Type?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We cater to every travel need. Select your trip type and find the perfect vehicle match.
          </p>
        </div>

        {/* Trip Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tripTypes.map((trip, index) => (
            <Link 
              key={trip.type} 
              to={`/fleet?tripType=${trip.type}`}
              className="group"
            >
              <Card 
                className="relative overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={trip.image}
                    alt={`${trip.title} travel`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
                </div>

                <CardContent className="relative z-10 h-full min-h-[320px] flex flex-col justify-end p-6">
                  {/* Icon Badge */}
                  <div className={`w-14 h-14 rounded-2xl ${trip.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <trip.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {trip.title}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {trip.description}
                  </p>

                  <div className="flex items-center gap-2 text-secondary font-medium group-hover:gap-3 transition-all">
                    <span>Find Vehicles</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
