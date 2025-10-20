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
        className={`w-full text-left p-2.5 sm:p-3.5 lg:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
          isDisabled
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 cursor-default shadow-sm"
            : feature.enabled
              ? "border-primary bg-gradient-to-br from-primary/5 to-purple-50 shadow-md hover:shadow-lg"
              : "border-slate-300 bg-white hover:border-primary/50 hover:bg-slate-50 hover:shadow-md"
        }`}
      >
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-start gap-1.5 sm:gap-2 lg:gap-2.5">
            <div
              className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isDisabled
                  ? "bg-gradient-to-br from-emerald-600 to-green-600 border-emerald-600 shadow-sm"
                  : feature.enabled
                    ? "bg-gradient-to-br from-primary to-purple-600 border-primary shadow-sm"
                    : "border-slate-400 bg-white"
              }`}
            >
              {(feature.enabled || isDisabled) && (
                <Check className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white font-bold" />
              )}
            </div>

            <h4
              className={`font-bold text-xs sm:text-sm lg:text-base leading-tight flex-grow ${
                isDisabled ? "text-emerald-900" : "text-slate-900"
              }`}
            >
              <span className="lg:hidden">{feature.shortName || feature.name}</span>
              <span className="hidden lg:inline">{feature.name}</span>
            </h4>
          </div>
          <p
            className={`hidden lg:block text-sm leading-snug pl-7 font-medium ${
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
