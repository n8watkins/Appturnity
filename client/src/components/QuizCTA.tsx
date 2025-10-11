import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSmoothScroll } from "@/lib/utils";

interface QuizCTAProps {
  variant?: "banner" | "card";
  className?: string;
}

export default function QuizCTA({ variant = "banner", className = "" }: QuizCTAProps) {
  if (variant === "card") {
    // Card variant for Hero section
    return (
      <motion.div
        className={`bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-2xl text-center ${className}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <Button
            size="default"
            className="gap-2 group text-sm md:text-base font-semibold"
            asChild
          >
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
            >
              Start Quiz
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        <h3 className="font-bold text-lg md:text-2xl mb-1 md:mb-2 text-primary">
          Find Your Perfect Solution
        </h3>
        <p className="text-slate-700 text-sm md:text-base">
          Take our 2-minute quiz to get a personalized recommendation
        </p>
      </motion.div>
    );
  }

  // Banner variant for between sections
  return (
    <section className={`py-12 bg-gradient-to-r from-primary/5 via-purple-50 to-primary/5 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Quick & Easy</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Take our interactive quiz to discover the perfect web solution for your business.
            Get personalized recommendations in just 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-slate-700">Only 9 questions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-slate-700">No email required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-slate-700">Instant results</span>
            </div>
          </div>

          <Button
            size="lg"
            className="gap-2 group text-lg px-8 h-14"
            asChild
          >
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
            >
              Take the Quiz
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
