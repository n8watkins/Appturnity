/**
 * Feature Card Component
 *
 * Reusable card for displaying a feature with checkbox-style selection
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { FeatureWithEnabled } from "./pricingCalculatorUtils";

interface FeatureCardProps {
  feature: FeatureWithEnabled;
  onToggle: () => void;
  index: number;
}

export function FeatureCard({ feature, onToggle, index }: FeatureCardProps) {
  const isDisabled = feature.isAlwaysIncluded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={isDisabled}
        className={`w-full text-left p-2.5 sm:p-3.5 rounded-lg border-2 transition-all ${
          isDisabled
            ? "border-emerald-300 bg-emerald-50 cursor-default"
            : feature.enabled
              ? "border-primary bg-primary/5"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
        }`}
      >
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-start gap-2 sm:gap-2.5">
            <div
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                isDisabled
                  ? "bg-emerald-600 border-emerald-600"
                  : feature.enabled
                    ? "bg-primary border-primary"
                    : "border-slate-400"
              }`}
            >
              {(feature.enabled || isDisabled) && <Check className="h-3.5 w-3.5 text-white" />}
            </div>

            <h4
              className={`font-semibold text-sm sm:text-base leading-tight flex-grow ${
                isDisabled ? "text-emerald-800" : "text-slate-900"
              }`}
            >
              {feature.name}
            </h4>
          </div>
          <p
            className={`hidden md:block text-sm leading-snug pl-7 ${
              isDisabled ? "text-emerald-700" : "text-slate-600"
            }`}
          >
            {feature.description}
          </p>
        </div>
      </button>
    </motion.div>
  );
}
