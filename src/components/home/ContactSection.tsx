import { PhoneCall, Mail, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactSection() {
  return (
    <section className="gradient-hero relative overflow-hidden min-h-[70vh]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/booking" className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-5 py-2 mb-6 animate-fade-in hover:bg-secondary/25 transition">
            <Send className="w-4 h-4 text-secondary" />
            <span className="text-primary-foreground font-semibold text-sm">Get in Touch</span>
          </Link>

          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4 animate-slide-up">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Have questions or feedback? Reach out and we’ll help you plan your next journey.
          </p>
        </div>

        <div className="mt-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Numbers */}
            <div className="bg-card/20 backdrop-blur rounded-xl p-6 border border-primary-foreground/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-3 text-primary-foreground">Call Us</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <a href="tel:+919363999899" className="block hover:text-primary-foreground transition-colors">
                  +91 93639 98989
                </a>
                <a href="tel:+916381334177" className="block hover:text-primary-foreground transition-colors">
                  +91 63813 34177
                </a>
                <a href="tel:+918825447736" className="block hover:text-primary-foreground transition-colors">
                  +91 88254 47736
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card/20 backdrop-blur rounded-xl p-6 border border-primary-foreground/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-3 text-primary-foreground">Email Us</h3>
              <a href="mailto:info@cbstravelmate.com" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                info@cbstravelmate.com
              </a>
            </div>

            {/* Address */}
            <div className="bg-card/20 backdrop-blur rounded-xl p-6 border border-primary-foreground/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-medium text-lg mb-3 text-primary-foreground">Visit Us</h3>
              <address className="not-italic text-primary-foreground/80">
                123 Travel Street,<br />
                Chennai,<br />
                Tamil Nadu - 600001
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
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
