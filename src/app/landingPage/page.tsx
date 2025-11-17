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
        <title>
          UpPersona Ai | Create, Schedule & Grow Your TikTok, Instagram, YouTube & Facebook Brand
        </title>
        <meta
          name="description"
          content="UpPersona Ai helps you create, schedule, and publish viral content across TikTok, Instagram, YouTube, and Facebook using powerful AI tools for creators and brands."
        />
        <meta property="og:title" content="UpPersona Ai" />
        <meta
          property="og:description"
          content="Create, schedule, and publish posts with AI — from viral ideas to analytics. Grow your TikTok, Instagram, YouTube, and Facebook brand faster with UpPersona Ai."
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