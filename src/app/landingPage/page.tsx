import FeaturesSection from '@/features/landingPage/components/FeaturesSection';
import HeroSection from '@/features/landingPage/components/HeroSection';
import TestimonialsSection from '@/features/landingPage/components/TestimonialsSection';
import Footer from '@/features/landingPage/components/Footer';
import CTASection from '@/features/landingPage/components/CTASection';
import Head from 'next/head';


export default function LandingPage() {
  return (
    <>
      <Head>
        <title>PersonalBrandingAI | Grow Your TikTok & Instagram Brand</title>
        <meta
          name="description"
          content="Generate viral content ideas, carousels, and scripts for your personal brand using AI."
        />
        <meta property="og:title" content="PersonalBrandingAI" />
        <meta
          property="og:description"
          content="Build and grow your brand faster with AI-powered content tools."
        />
      </Head>

      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}