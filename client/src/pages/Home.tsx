import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowWeWork from "@/components/HowWeWork";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import PricingCalculator from "@/components/PricingCalculator";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import QuizCTA from "@/components/QuizCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <HowWeWork />
        <About />
        <QuizCTA variant="banner" />
        <Portfolio />
        <Testimonials />
        <PricingCalculator />
        <Contact />
        <ChatWidget/>
      </div>
      <Footer />
    </div>
  );
}
