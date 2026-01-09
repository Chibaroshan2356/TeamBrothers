import { Shield, Clock, ThumbsUp, HeartHandshake, Headphones, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safe & Reliable',
    description: 'All vehicles undergo regular maintenance checks. Your safety is our top priority.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book anytime, travel anytime. We are always ready to serve you.',
  },
  {
    icon: ThumbsUp,
    title: 'Best Value',
    description: 'Competitive pricing with no hidden charges. Transparent cost estimation.',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted Service',
    description: '500+ successful trips and counting. Join our family of happy travelers.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Our team is always available to assist you before, during, and after your journey.',
  },
  {
    icon: Award,
    title: 'Professional Drivers',
    description: 'Experienced, trained drivers who know the roads and prioritize your comfort.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Team Brother's?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We go beyond just vehicle rentals. Experience the difference of traveling with a trusted partner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
