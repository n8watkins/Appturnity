import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director, TechStart",
    content:
      "They delivered exactly what we needed without all the extra fluff. Our team tracker app is intuitive, focused, and costs a fraction of what we were paying for bloated alternatives.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, GreenDelivery",
    content:
      "The flat monthly fee is refreshing. We can add as many users as we need without worrying about costs exploding. The app is exactly what our delivery business needed.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Office Manager, Corvus Legal",
    content:
      "Their client intake app transformed our firm. We tried several off-the-shelf solutions but none fit our workflow. Appturnity built exactly what we needed - no more, no less.",
  },
  {
    id: 4,
    name: "David Park",
    role: "CEO, FitLife Studios",
    content:
      "We needed a simple booking system for our fitness classes. Appturnity delivered in weeks, not months. The app is fast, reliable, and our members love how easy it is to use.",
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "Operations Manager, QuickServe Restaurants",
    content:
      "Their no-frills approach saved us thousands. We got a custom inventory management system that actually works for our workflow. No unnecessary features, just what we need.",
  },
  {
    id: 6,
    name: "Robert Thompson",
    role: "Director, Heritage Construction",
    content:
      "Finally, a development team that understands budget constraints. Our project management app handles everything we need without the enterprise price tag. Highly recommended.",
  },
  {
    id: 7,
    name: "Amanda Lee",
    role: "Founder, Pawsitive Pet Care",
    content:
      "The client portal they built streamlined our entire booking process. Pet parents can schedule appointments, view records, and pay invoices all in one place. Game changer for our business.",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Partner, Summit Financial Advisors",
    content:
      "We needed a secure client document portal that met compliance requirements. Appturnity delivered exactly that - nothing fancy, just solid, reliable software that does the job.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerView = 3;

  // Auto-rotate testimonials every 5 seconds (when not paused)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= testimonials.length - itemsPerView + 1 ? 0 : nextIndex;
    });
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? testimonials.length - itemsPerView : prevIndex - 1;
    });
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);
  const totalSlides = Math.max(1, testimonials.length - itemsPerView + 1);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-16"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 rounded-full">
              <p className="text-white font-semibold text-sm">Client Success Stories</p>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-slate-300">
            Real feedback from real businesses who made the switch.
          </p>
        </motion.div>

        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-3 shadow-lg hover:bg-primary hover:border-primary transition-all hover:scale-110"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-3 shadow-lg hover:bg-primary hover:border-primary transition-all hover:scale-110"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden px-4 py-4 -mx-4 -my-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  enter: {
                    x: { type: "spring", stiffness: 400, damping: 35 },
                    opacity: { duration: 0.15 },
                  },
                  exit: {
                    x: { type: "spring", stiffness: 250, damping: 28 },
                    opacity: { duration: 0.25 },
                  },
                }}
                className="grid md:grid-cols-3 gap-8"
              >
                {visibleTestimonials.map((testimonial, idx) => (
                  <div key={testimonial.id} className="group relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                    <Card className="relative h-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 transition-all duration-300 hover:scale-105 hover:border-primary/50 cursor-pointer select-none group-hover:shadow-2xl">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-slate-400 mb-3">{testimonial.role}</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{testimonial.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-gradient-to-r from-primary to-purple-500"
                    : "w-2 bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
