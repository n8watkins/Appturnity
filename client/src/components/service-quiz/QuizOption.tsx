/**
 * Quiz Option Component
 *
 * Individual selectable option button with checkbox/radio style
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface QuizOptionProps {
  option: {
    value: string;
    label: string;
    description?: string;
    mobileLabel?: string;
  };
  isSelected: boolean;
  isMultiSelect: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  index: number;
}

export function QuizOption({
  option,
  isSelected,
  isMultiSelect,
  isDisabled,
  onSelect,
  index,
}: QuizOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={isDisabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      } ${isDisabled && !isMultiSelect ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <div
          className={`mt-0.5 w-5 h-5 rounded ${isMultiSelect ? "rounded" : "rounded-full"} border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            isSelected ? "bg-primary border-primary" : "border-slate-400 bg-white"
          }`}
        >
          {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
        <div className="flex-grow">
          <h4 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">
            <span className="md:hidden">{option.mobileLabel || option.label}</span>
            <span className="hidden md:inline">{option.label}</span>
          </h4>
          {option.description && (
            <p className="text-sm text-slate-600 hidden md:block">{option.description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
