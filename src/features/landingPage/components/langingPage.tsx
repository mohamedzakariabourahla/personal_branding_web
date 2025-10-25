import FeaturesSection from '@/features/landingPage/components/FeaturesSection';
import HeroSection from '@/features/landingPage/components/HeroSection';
import TestimonialsSection from '@/features/landingPage/components/TestimonialsSection';
import Footer from '@/features/landingPage/components/Footer';
import CTASection from '@/features/landingPage/components/CTASection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}