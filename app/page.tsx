'use client';

// Import the original components directly from the client code
// This is a temporary solution until all components are migrated
import Header from '../client/src/components/Header';
import Hero from '../client/src/components/Hero';
import HowWeWork from '../client/src/components/HowWeWork';
import About from '../client/src/components/About';
import Testimonials from '../client/src/components/Testimonials';
import PricingCalculator from '../client/src/components/PricingCalculator';
import Contact from '../client/src/components/Contact';
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