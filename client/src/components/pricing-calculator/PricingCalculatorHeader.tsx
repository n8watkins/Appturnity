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
      className="max-w-3xl mx-auto text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
        Build Your Perfect Solution
      </h2>
      <p className="text-lg text-slate-300">
        Configure your project, select features, and see your investment instantly. Pay once, own
        forever.
      </p>

      {prefilledFromQuiz && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
        >
          <Check className="h-4 w-4" />
          Based on your quiz results
        </motion.div>
      )}
    </motion.div>
  );
}
