import { HeroSection } from '@/components/home/HeroSection';
import { TripTypeSection } from '@/components/home/TripTypeSection';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

/**
 * Home Page Component
 * 
 * This is the main landing page featuring:
 * - Hero section with call-to-action
 * - Trip type selector (Family / Friends / Office)
 * - Featured vehicle cards
 * - Why choose us section
 * 
 * SEO: Includes proper semantic HTML structure
 */
const Index = () => {
  return (
    <>
      {/* Hero Section - Main CTA */}
      <HeroSection />
      
      {/* Trip Type Selector */}
      <TripTypeSection />
      
      {/* Featured Vehicles */}
      <FeaturedVehicles />
      
      {/* Trust & Features */}
      <WhyChooseUs />
    </>
  );
};

export default Index;
