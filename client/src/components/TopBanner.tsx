import { useState, useEffect } from "react";

import { Phone, Sparkles } from "lucide-react";

import { motion } from "framer-motion";

import { useLocation } from "wouter";

import { CalendlyButton } from "@/components/ui/calendly-embed";

import { Button } from "@/components/ui/button";

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/nathancwatkins23/web-consulting";
export default function TopBanner() {
  const [location, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Calculate time until end of day
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuizClick = () => {
    // If we're not on the home page, navigate there first
    if (location !== "/") {
      setLocation("/");
      // Wait for navigation to complete, then scroll and start quiz
      setTimeout(() => {
        window.dispatchEvent(new Event("startQuiz"));
        const quizSection = document.getElementById("quiz");
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      // Already on home page, just scroll and start quiz
      window.dispatchEvent(new Event("startQuiz"));
      const quizSection = document.getElementById("quiz");
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-primary via-blue-600 to-primary text-white py-3 px-4 relative overflow-hidden select-none"
    >
      {/* Animated background shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between gap-6">
          {/* Timer - Left side on desktop, hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-white/30">
              {String(timeLeft.hours).padStart(2, "0")}h
            </span>
            <span className="text-white/80">:</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-white/30">
              {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
            <span className="text-white/80">:</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-white/30">
              {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>

          {/* Center Message with Quiz Button */}
          <div className="flex-1 flex items-center justify-center gap-3">
            <Button
              onClick={handleQuizClick}
              size="sm"
              className="bg-yellow-300 text-primary hover:bg-yellow-400 font-bold shadow-lg transition-colors border-2 border-yellow-400"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Take our quiz
            </Button>
            <span className="text-sm sm:text-base font-semibold hidden sm:inline">
              for a <span className="text-yellow-300 font-bold">10% discount</span>
            </span>
          </div>

          {/* Phone & Appointment CTA - Right side */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <a
              href="tel:+18182888082"
              className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors font-semibold"
            >
              <Phone className="h-4 w-4" />
              <span>(818) 288-8082</span>
            </a>
            <span className="text-white/60 mx-1">or</span>
            <CalendlyButton
              url={CALENDLY_URL}
              className="bg-white text-primary hover:bg-yellow-300 hover:text-primary transition-colors shadow-lg font-bold border-2 border-white/20"
              size="sm"
            >
              Book Now
            </CalendlyButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
