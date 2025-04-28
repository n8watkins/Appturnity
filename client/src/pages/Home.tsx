import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowWeWork from "@/components/HowWeWork";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import PricingCalculator from "@/components/PricingCalculator";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TextUsWidget from "@/components/TextUsWidget";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <HowWeWork />
        <About />
        <Portfolio />
        <Testimonials />
        <PricingCalculator />
        <Contact />
        <TextUsWidget/>
      </div>
      <Footer />
    </div>
  );
}
