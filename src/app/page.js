// src/app/page.js
import AnnouncementBar from '@/components/public/AnnouncementBar.jsx';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import StatsSection from '@/components/public/StatsSection';
import ServicesSection from '@/components/public/ServicesSection';
import IndustriesSection from '@/components/public/IndustriesSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import CareersSection from '@/components/public/CareersSection';
import Footer from '@/components/public/Footer';

export default function HomePage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CareersSection />
      <Footer />
    </main>
  );
}