import { Clock, MessageCircle, Send, Phone, Mail, MapPin } from 'lucide-react';
import { ContactSection } from '@/components/home/ContactSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name required').max(100),
  email: z.string().trim().email('Valid email required').max(255),
  message: z.string().trim().min(10, 'Message too short').max(1000),
});

/**
 * Contact Page Component
 * 
 * Features:
 * - Click-to-call functionality
 * - WhatsApp integration
 * - Google Maps embed
 * - Contact form
 */
const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse({ name, email, message });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });

        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi TravelEase! I'd like to enquire about vehicle rentals.");
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Contact Information Section */}
      <ContactSection />
      
      {/* Contact Form Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                {/* Quick Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Call */}
                  <div className="group">
                    <Card className="h-full hover:border-primary/30 transition-all hover:shadow-lg">
                      <CardContent className="pt-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                          <Phone className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-1">Call Us</h3>
                        <a href="tel:+919363998989" className="text-primary font-medium block hover:underline">+91 93639 98989</a>
                        <a href="tel:+916381334177" className="text-primary font-medium block hover:underline">+91 63813 34177</a>
                        <a href="tel:+918825447736" className="text-primary font-medium block hover:underline">+91 88254 47736</a>
                        <a href="tel:+919715640337" className="text-primary font-medium block hover:underline">+91 97156 40337</a>
                        <p className="text-xs text-muted-foreground mt-1">Tap to call</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* WhatsApp */}
                  <Card 
                    className="h-full hover:border-success/30 transition-all hover:shadow-lg cursor-pointer"
                    onClick={handleWhatsApp}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                        <MessageCircle className="w-7 h-7 text-success" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-1">WhatsApp</h3>
                      <p className="text-success font-medium">Chat Now</p>
                      <p className="text-xs text-muted-foreground mt-1">Quick response</p>
                    </CardContent>
                  </Card>
                </div>

            {/* Detailed Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:bookings@travelease.com" className="text-muted-foreground hover:text-primary transition-colors">
                      bookings@travelease.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Office Address</h4>
                    <p className="text-muted-foreground">
                      123 Travel Hub, Main Road<br />
                      City Center, India - 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Working Hours</h4>
                    <p className="text-muted-foreground">
                      Monday - Sunday<br />
                      6:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1679900000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TravelEase Location"
                />
              </CardContent>
            </Card>
              </div>

              {/* Contact Form */}
              <Card className="h-fit">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
