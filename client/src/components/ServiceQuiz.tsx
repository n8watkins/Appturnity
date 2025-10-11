import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "projectType",
    question: "What type of website do you need?",
    options: [
      { value: "landing-page", label: "Landing Page", description: "Single page to drive conversions" },
      { value: "business-website", label: "Business Website", description: "Multi-page company site" },
      { value: "web-app", label: "Web Application", description: "Custom interactive tool or platform" },
      { value: "ecommerce", label: "E-commerce", description: "Online store to sell products" },
      { value: "not-sure", label: "Not Sure", description: "Help me figure it out" },
    ],
  },
  {
    id: "primaryGoal",
    question: "What's your primary goal?",
    options: [
      { value: "generate-leads", label: "Generate Leads", description: "Get more inquiries and contacts" },
      { value: "sell-products", label: "Sell Products/Services", description: "Drive online sales" },
      { value: "build-brand", label: "Build Brand Awareness", description: "Increase visibility and credibility" },
      { value: "automate-process", label: "Automate Business Process", description: "Save time with custom tools" },
      { value: "replace-saas", label: "Replace Expensive SaaS", description: "Own your solution, cut monthly costs" },
    ],
  },
  {
    id: "features",
    question: "Do you need any custom features?",
    options: [
      { value: "contact-forms", label: "Contact Forms", description: "Lead capture and inquiries" },
      { value: "booking-scheduling", label: "Booking/Scheduling", description: "Appointment management" },
      { value: "payment-integration", label: "Payment Integration", description: "Accept payments online" },
      { value: "user-accounts", label: "User Accounts", description: "Login and user profiles" },
      { value: "integrations", label: "Third-party Integrations", description: "Connect with other tools" },
      { value: "custom-tools", label: "Custom Tools/Calculators", description: "Interactive features" },
    ],
  },
  {
    id: "timeline",
    question: "What's your timeline?",
    options: [
      { value: "asap", label: "As soon as possible", description: "Urgent need" },
      { value: "1-2-months", label: "1-2 months", description: "Normal timeline" },
      { value: "3-6-months", label: "3-6 months", description: "Long-term planning" },
      { value: "flexible", label: "Flexible", description: "No rush" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget range?",
    options: [
      { value: "under-5k", label: "Under $5,000", description: "Starter package" },
      { value: "5k-10k", label: "$5,000 - $10,000", description: "Standard project" },
      { value: "10k-25k", label: "$10,000 - $25,000", description: "Advanced project" },
      { value: "25k-plus", label: "$25,000+", description: "Enterprise solution" },
      { value: "not-sure", label: "Not sure yet", description: "Need guidance" },
    ],
  },
];

interface ServiceQuizProps {
  onComplete: (results: Record<string, string>) => void;
}

export default function ServiceQuiz({ onComplete }: ServiceQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption("");
    } else {
      // Quiz complete
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(answers[quizQuestions[currentStep - 1].id] || "");
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardContent className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentStep + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-bold text-slate-900">
                  {currentQuestion.question}
                </h3>
              </div>
              <p className="text-slate-600">Select the option that best fits your needs</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    ${
                      selectedOption === option.value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0
                      ${
                        selectedOption === option.value
                          ? "border-primary bg-primary"
                          : "border-slate-300"
                      }
                    `}
                    >
                      {selectedOption === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-slate-600 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="gap-2"
          >
            {currentStep < quizQuestions.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Complete Quiz
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
