import { Metadata } from 'next';
import FeaturesSection from '@/features/landingPage/components/FeaturesSection';
import HeroSection from '@/features/landingPage/components/HeroSection';
import TestimonialsSection from '@/features/landingPage/components/TestimonialsSection';
import Footer from '@/features/landingPage/components/Footer';
import CTASection from '@/features/landingPage/components/CTASection';

export const metadata: Metadata = {
  title: 'UpPersona Ai | Create, Schedule & Grow Your TikTok, Instagram, YouTube & Facebook Brand',
  description:
    'UpPersona Ai helps you create, schedule, and publish viral content across TikTok, Instagram, YouTube, and Facebook using powerful AI tools for creators and brands.',
  openGraph: {
    title: 'UpPersona Ai',
    description:
      'Create, schedule, and publish posts with AI — from viral ideas to analytics. Grow your TikTok, Instagram, YouTube, and Facebook brand faster with UpPersona Ai.',
  },
};

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
