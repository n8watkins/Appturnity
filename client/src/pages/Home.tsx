import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowWeWork from "@/components/HowWeWork";
import WhyNotDIY from "@/components/WhyNotDIY";
import About from "@/components/About";
import WhatYouGet from "@/components/WhatYouGet";
import Footer from "@/components/Footer";
import QuizCTA from "@/components/QuizCTA";
import Quiz from "@/components/Quiz";

// Lazy load heavy components that are below the fold
const Portfolio = lazy(() => import("@/components/Portfolio"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const PricingCalculator = lazy(() => import("@/components/PricingCalculator"));
const Contact = lazy(() => import("@/components/Contact"));
const ChatWidget = lazy(() => import("@/components/ChatWidget"));

// Loading fallback component for lazy-loaded sections
function SectionLoader() {
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <WhyNotDIY />
        <About />
        <WhatYouGet />
        <QuizCTA variant="banner" />

        <Suspense fallback={<SectionLoader />}>
          <Portfolio />
        </Suspense>

        <HowWeWork />

        <Suspense fallback={<SectionLoader />}>
          <Testimonials />
        </Suspense>

        <Quiz />

        <Suspense fallback={<SectionLoader />}>
          <PricingCalculator />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ChatWidget />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
