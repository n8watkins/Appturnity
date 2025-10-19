/**
 * Quiz Progress Bar Component
 *
 * Shows visual progress through the quiz
 */

import { motion } from "framer-motion";

interface QuizProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function QuizProgressBar({ currentStep, totalSteps }: QuizProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">
          Question {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-slate-600">{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
