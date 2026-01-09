import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
              <Car className="w-7 h-7" />
              <span>Team Brother's</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your trusted partner for comfortable and reliable vehicle rentals. 
              Perfect for family vacations, friend outings, and corporate travel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/fleet', label: 'Our Fleet' },
                { href: '/recommend', label: 'Smart Recommend' },
                { href: '/booking', label: 'Book Now' },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>bookings@travelease.com</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>123 Travel Hub, Main Road, City Center, India - 400001</span>
              </li>
            </ul>
          </div>

          {/* Social & Hours */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/cbs_travelmate/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {[Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <h4 className="font-heading font-semibold text-lg mb-2">Working Hours</h4>
            <p className="text-primary-foreground/80 text-sm">
              Mon - Sun: 6:00 AM - 10:00 PM
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} Team Brother's Vehicle Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
