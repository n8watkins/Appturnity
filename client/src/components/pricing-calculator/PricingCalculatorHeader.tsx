/**
 * Project Builder Header Component
 *
 * Displays the title, description, and quiz badge
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingCalculatorHeaderProps {
  prefilledFromQuiz: boolean;
}

export function PricingCalculatorHeader({ prefilledFromQuiz }: PricingCalculatorHeaderProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto text-center mb-10 sm:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
        Build Your Perfect Solution
      </h2>
      <p className="text-sm sm:text-base text-slate-300 font-medium">
        Customize your project and see pricing in real-time
      </p>

      {prefilledFromQuiz && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 rounded-full text-sm font-bold shadow-lg border-2 border-green-300"
        >
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
          Based on your quiz results
        </motion.div>
      )}
    </motion.div>
  );
}
