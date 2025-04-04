'use client';

// Import the migrated components
import Header from './components/Header';
import Hero from './components/Hero';
import Contact from './components/Contact';

// Still using original components while migration is in progress
import HowWeWork from '../client/src/components/HowWeWork';
import About from '../client/src/components/About';
import Testimonials from '../client/src/components/Testimonials';
import PricingCalculator from '../client/src/components/PricingCalculator';
import Footer from '../client/src/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <HowWeWork />
        <About />
        <Testimonials />
        <PricingCalculator />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}