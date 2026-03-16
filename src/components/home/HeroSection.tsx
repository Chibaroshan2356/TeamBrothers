import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-[#082c2c] via-[#0f3d3e] to-[#1f5f66] overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-primary-foreground text-sm font-medium">
                Trusted by 500+ Happy Travelers
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-6">
              Your Journey, <span className="text-gradient">Our Wheels</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-xl">
              From intimate family getaways to grand corporate events,
              experience comfort and reliability with our premium fleet of
              6 meticulously maintained vehicles.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/fleet">
                <Button size="lg" variant="secondary" className="text-base px-6">
                  Explore Fleet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link to="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-6 py-3 rounded-xl font-semibold bg-slate-100/90 text-slate-900 hover:bg-white"
                >
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { value: '6', label: 'Vehicles' },
                { value: '500+', label: 'Happy Trips' },
                { value: '24/7', label: 'Support' },
                { value: '100%', label: 'Safe Journeys' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Floating Cards */}
          <div className="hidden lg:flex flex-col gap-6 items-end -mt-12">

            {/* Group Size */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Group Size</p>
                  <p className="text-white font-bold text-lg">Upto 54 People</p>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg mr-12 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Destinations</p>
                  <p className="text-white font-bold text-lg">Pan India</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg animate-float" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Availability</p>
                  <p className="text-white font-bold text-lg">24/7 Service</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-4">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="hsl(var(--background))"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
          />
        </svg>
      </div>

    </section>
  );
}