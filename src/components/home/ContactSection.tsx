import { PhoneCall, Mail, MapPin } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Numbers */}
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneCall className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-3">Call Us</h3>
              <div className="space-y-2">
                <a href="tel:+919363999899" className="block text-muted-foreground hover:text-foreground transition-colors">
                  +91 93639 98989
                </a>
                <a href="tel:+916381334177" className="block text-muted-foreground hover:text-foreground transition-colors">
                  +91 63813 34177
                </a>
                <a href="tel:+918825447736" className="block text-muted-foreground hover:text-foreground transition-colors">
                  +91 88254 47736
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-3">Email Us</h3>
              <a href="mailto:info@cbstravelmate.com" className="text-muted-foreground hover:text-foreground transition-colors">
                info@cbstravelmate.com
              </a>
            </div>

            {/* Address */}
            <div className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-3">Visit Us</h3>
              <address className="not-italic text-muted-foreground">
                123 Travel Street,<br />
                Chennai,<br />
                Tamil Nadu - 600001
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
