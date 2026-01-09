import { ArrowRight, MapPin, Calendar, Users, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-primary-foreground text-sm font-medium">Trusted by 500+ Happy Travelers</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Your Journey,{' '}
              <span className="text-gradient">Our Wheels</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              From intimate family getaways to grand corporate events, experience comfort and reliability with our premium fleet of 10 meticulously maintained vehicles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/fleet">
                <Button size="lg" variant="secondary" className="text-lg px-8 shadow-warm">
                  Explore Fleet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/recommend">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-3 rounded-xl font-semibold bg-slate-100/90 text-slate-900  hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Get Recommendation
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { value: '10', label: 'Vehicles' },
                { value: '500+', label: 'Happy Trips' },
                { value: '24/7', label: 'Support' },
                { value: '100%', label: 'Safe Journeys' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Boxes */}
          <div className="hidden lg:flex flex-col gap-6 items-end">
            <div className="animate-float">
              <div className="bg-card/20 backdrop-blur-md rounded-2xl p-5 border border-primary-foreground/20 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Group Size</p>
                    <p className="text-primary-foreground font-bold text-lg">Upto 54 People</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-float mr-12" style={{ animationDelay: '1s' }}>
              <div className="bg-card/20 backdrop-blur-md rounded-2xl p-5 border border-primary-foreground/20 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Destinations</p>
                    <p className="text-primary-foreground font-bold text-lg">Pan India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-card/20 backdrop-blur-md rounded-2xl p-5 border border-primary-foreground/20 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Availability</p>
                    <p className="text-primary-foreground font-bold text-lg">24/7 Service</p>
                  </div>
                </div>
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
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
