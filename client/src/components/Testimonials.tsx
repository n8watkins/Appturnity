import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director, TechStart",
    content: "They delivered exactly what we needed without all the extra fluff. Our team tracker app is intuitive, focused, and costs a fraction of what we were paying for bloated alternatives."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, GreenDelivery",
    content: "The flat monthly fee is refreshing. We can add as many users as we need without worrying about costs exploding. The app is exactly what our delivery business needed."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Office Manager, Corvus Legal",
    content: "Their client intake app transformed our firm. We tried several off-the-shelf solutions but none fit our workflow. Appturnity built exactly what we needed - no more, no less."
  },
  {
    id: 4,
    name: "David Park",
    role: "CEO, FitLife Studios",
    content: "We needed a simple booking system for our fitness classes. Appturnity delivered in weeks, not months. The app is fast, reliable, and our members love how easy it is to use."
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "Operations Manager, QuickServe Restaurants",
    content: "Their no-frills approach saved us thousands. We got a custom inventory management system that actually works for our workflow. No unnecessary features, just what we need."
  },
  {
    id: 6,
    name: "Robert Thompson",
    role: "Director, Heritage Construction",
    content: "Finally, a development team that understands budget constraints. Our project management app handles everything we need without the enterprise price tag. Highly recommended."
  },
  {
    id: 7,
    name: "Amanda Lee",
    role: "Founder, Pawsitive Pet Care",
    content: "The client portal they built streamlined our entire booking process. Pet parents can schedule appointments, view records, and pay invoices all in one place. Game changer for our business."
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Partner, Summit Financial Advisors",
    content: "We needed a secure client document portal that met compliance requirements. Appturnity delivered exactly that - nothing fancy, just solid, reliable software that does the job."
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerView = 3;

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerView >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, testimonials.length - itemsPerView) : prevIndex - 1
    );
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
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="testimonials" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-slate-600">Don't just take our word for it. Here's what others have to say about working with us.</p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= testimonials.length - itemsPerView}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-6 w-6 text-slate-700" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="grid md:grid-cols-3 gap-8"
              >
                {visibleTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="h-full shadow border border-slate-200">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                      <div className="mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600">{testimonial.content}</p>
                    </CardContent>
                  </Card>
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
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
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
