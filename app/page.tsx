import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowWeWork from '@/components/HowWeWork';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import PricingCalculator from '@/components/PricingCalculator';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

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