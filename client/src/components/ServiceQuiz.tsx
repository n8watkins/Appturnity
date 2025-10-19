/**
 * Service Quiz Component (Refactored)
 *
 * Interactive quiz to help users find their perfect solution.
 * Reduced from 627 lines to ~250 lines through component extraction.
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quizQuestions } from "@/data/quizQuestions";
import { QuizStartScreen, QuizCompletionScreen, QuizProgressBar, QuizOption } from "./service-quiz";

interface ServiceQuizProps {
  onComplete: (results: Record<string, string | string[]>) => void;
  autoStart?: boolean;
}

export default function ServiceQuiz({ onComplete, autoStart = false }: ServiceQuizProps) {
  const [hasStarted, setHasStarted] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = quizQuestions[currentStep];
  const isMultiSelect = currentQuestion?.multiSelect;

  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      // Handle multi-select toggle
      const newSelected = selectedOptions.includes(value)
        ? selectedOptions.filter((v) => v !== value)
        : [...selectedOptions, value];
      setSelectedOptions(newSelected);
    } else {
      // Prevent selection if already advancing
      if (isAdvancing) return;

      // Clear any pending timeout to prevent race condition
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }

      // Lock selections
      setIsAdvancing(true);

      // Handle single select with auto-advance
      setSelectedOptions([value]);
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      // Auto-advance after short delay for visual feedback
      advanceTimeoutRef.current = setTimeout(() => {
        if (currentStep < quizQuestions.length - 1) {
          setCurrentStep(currentStep + 1);
          const nextQuestion = quizQuestions[currentStep + 1];
          const nextAnswer = newAnswers[nextQuestion.id];
          setSelectedOptions(
            Array.isArray(nextAnswer) ? nextAnswer : nextAnswer ? [nextAnswer] : []
          );
          setIsAdvancing(false);
        } else {
          // Quiz complete - show celebration
          setIsCompleted(true);
          setTimeout(() => {
            onComplete(newAnswers);
            // Reset quiz after completion
            setTimeout(() => {
              setIsCompleted(false);
              setCurrentStep(0);
              setAnswers({});
              setSelectedOptions([]);
              setIsAdvancing(false);
            }, 500);
          }, 2500);
        }
        advanceTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOptions };
    setAnswers(newAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextQuestion = quizQuestions[currentStep + 1];
      const nextAnswer = newAnswers[nextQuestion.id];
      setSelectedOptions(Array.isArray(nextAnswer) ? nextAnswer : nextAnswer ? [nextAnswer] : []);
    } else {
      // Quiz complete
      setIsCompleted(true);
      setTimeout(() => {
        onComplete(newAnswers);
        setTimeout(() => {
          setIsCompleted(false);
          setCurrentStep(0);
          setAnswers({});
          setSelectedOptions([]);
        }, 500);
      }, 2500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Clear any pending timeout when going back
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
      setCurrentStep(currentStep - 1);
      const prevQuestion = quizQuestions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id];
      setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : prevAnswer ? [prevAnswer] : []);
      setIsAdvancing(false);
    }
  };

  // Show start screen
  if (!hasStarted) {
    return <QuizStartScreen onStart={() => setHasStarted(true)} />;
  }

  // Show completion screen
  if (isCompleted) {
    return <QuizCompletionScreen />;
  }

  // Show quiz interface
  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="p-8">
        {/* Progress Bar */}
        <QuizProgressBar currentStep={currentStep} totalSteps={quizQuestions.length} />

        {/* Question Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question Title */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-2">
                <HelpCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  {currentQuestion.question}
                </h3>
              </div>
              {isMultiSelect && (
                <p className="text-sm text-slate-600 ml-9">
                  Select all that apply, then click "Next"
                </p>
              )}
            </div>

            {/* Options Grid/List */}
            <div
              className={`space-y-3 mb-6 ${currentQuestion.options.length > 4 ? "grid md:grid-cols-2 gap-3" : ""}`}
            >
              {currentQuestion.options.map((option, index) => (
                <QuizOption
                  key={option.value}
                  option={option}
                  isSelected={selectedOptions.includes(option.value)}
                  isMultiSelect={!!isMultiSelect}
                  isDisabled={isAdvancing && !isMultiSelect}
                  onSelect={() => handleSelect(option.value)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {isMultiSelect && (
            <Button
              onClick={handleNext}
              disabled={selectedOptions.length === 0}
              className="ml-auto gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
