import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
  multiSelect?: boolean;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "pageCount",
    question: "How many pages will your website need?",
    options: [
      { value: "1-5", label: "1-5 Pages", description: "Simple site or landing page" },
      { value: "6-12", label: "6-12 Pages", description: "Professional business site" },
      { value: "13-20", label: "13-20 Pages", description: "Comprehensive website" },
      { value: "20+", label: "20+ Pages", description: "Large-scale solution" },
      { value: "not-sure", label: "Not Sure", description: "Help me decide" },
    ],
  },
  {
    id: "teamSize",
    question: "How many users will need access to manage or use the system?",
    options: [
      { value: "1-3", label: "1-3 Users", description: "Just me or small team" },
      { value: "4-7", label: "4-7 Users", description: "Small to medium team" },
      { value: "8-15", label: "8-15 Users", description: "Medium team" },
      { value: "15+", label: "15+ Users", description: "Large team or organization" },
    ],
  },
  {
    id: "currentSituation",
    question: "What's your current situation?",
    options: [
      { value: "no-website", label: "No Website Yet", description: "Starting from scratch" },
      { value: "outdated-website", label: "Outdated Website", description: "Need a modern redesign" },
      { value: "losing-leads", label: "Losing Leads", description: "Website isn't converting visitors" },
      { value: "paying-too-much", label: "Paying Too Much for SaaS", description: "Want to own my solution" },
      { value: "manual-processes", label: "Too Many Manual Processes", description: "Need automation tools" },
    ],
  },
  {
    id: "industry",
    question: "What industry are you in?",
    options: [
      { value: "professional-services", label: "Professional Services", description: "Consulting, legal, accounting" },
      { value: "healthcare", label: "Healthcare", description: "Medical, dental, wellness" },
      { value: "home-services", label: "Home Services", description: "HVAC, roofing, plumbing, contractors" },
      { value: "retail-ecommerce", label: "Retail/E-commerce", description: "Online or physical stores" },
      { value: "real-estate", label: "Real Estate", description: "Property sales or rentals" },
      { value: "technology", label: "Technology/SaaS", description: "Software or tech services" },
      { value: "hospitality", label: "Hospitality", description: "Restaurants, hotels, events" },
      { value: "other", label: "Other", description: "Not listed above" },
    ],
  },
  {
    id: "businessGoal",
    question: "What business outcomes do you want? (Select all that apply)",
    multiSelect: true,
    options: [
      { value: "more-customers", label: "Get More Customers", description: "Increase leads and sales" },
      { value: "save-time", label: "Save Time", description: "Automate repetitive tasks" },
      { value: "reduce-costs", label: "Reduce Costs", description: "Cut expensive subscriptions" },
      { value: "improve-credibility", label: "Look More Professional", description: "Build trust with better design" },
      { value: "scale-business", label: "Scale My Business", description: "Support growth with better systems" },
    ],
  },
  {
    id: "targetAudience",
    question: "Who is your primary target audience?",
    options: [
      { value: "b2b", label: "Businesses (B2B)", description: "Selling to other companies" },
      { value: "b2c", label: "Consumers (B2C)", description: "Selling to individuals" },
      { value: "both", label: "Both B2B and B2C", description: "Serve both markets" },
      { value: "internal", label: "Internal Team", description: "Tools for my own team" },
    ],
  },
  {
    id: "desiredFeatures",
    question: "What advanced features do you need? (Select all that apply)",
    multiSelect: true,
    options: [
      { value: "seo", label: "Advanced SEO", description: "Search engine optimization" },
      { value: "email-automation", label: "Email Automation", description: "Automated email sequences" },
      { value: "newsletter", label: "Newsletter Management", description: "Email list building" },
      { value: "forms", label: "Custom Forms", description: "Multi-step forms" },
      { value: "cms", label: "CMS", description: "Content management system" },
      { value: "blog", label: "Blog", description: "Blogging platform" },
      { value: "auth", label: "User Authentication", description: "Login & signup" },
      { value: "ecommerce", label: "E-commerce", description: "Cart & checkout" },
      { value: "payment", label: "Payment Processing", description: "Card processing" },
      { value: "booking", label: "Booking System", description: "Appointment scheduling" },
      { value: "api", label: "API Integration", description: "Third-party tools" },
      { value: "chat", label: "Live Chat", description: "Customer support" },
      { value: "crm", label: "CRM", description: "Customer management" },
      { value: "ai", label: "Generative AI", description: "AI-powered features" },
    ],
  },
  {
    id: "projectScope",
    question: "What type of solution fits your needs?",
    options: [
      { value: "simple-landing", label: "Simple Landing Page", description: "One page to capture leads" },
      { value: "full-website", label: "Complete Website", description: "Multi-page site with full content" },
      { value: "custom-app", label: "Custom Web Application", description: "Tailored tools for your workflow" },
      { value: "ecommerce-store", label: "E-commerce Store", description: "Sell products online" },
      { value: "not-sure", label: "Not Sure Yet", description: "Help me figure it out" },
    ],
  },
  {
    id: "existingAssets",
    question: "Do you have existing brand materials?",
    options: [
      { value: "full-brand", label: "Yes, Full Branding", description: "Logo, colors, fonts, guidelines" },
      { value: "partial-brand", label: "Some Materials", description: "Logo and colors only" },
      { value: "no-brand", label: "No, Need Help", description: "Starting from scratch" },
    ],
  },
  {
    id: "timeline",
    question: "When do you need this launched?",
    options: [
      { value: "urgent", label: "Within 4-6 Weeks", description: "Urgent business need" },
      { value: "normal", label: "6-10 Weeks", description: "Standard timeline" },
      { value: "planning", label: "10-16 Weeks", description: "Still planning details" },
      { value: "flexible", label: "16+ Weeks", description: "No immediate rush" },
    ],
  },
  {
    id: "investment",
    question: "What's your investment budget?",
    options: [
      { value: "budget-conscious", label: "$750 - $1,500", description: "Essential tier (1-5 pages)" },
      { value: "standard", label: "$1,700 - $3,000", description: "Professional tier (6-12 pages)" },
      { value: "premium", label: "$3,200 - $5,500", description: "Enterprise tier (13-20 pages)" },
      { value: "enterprise", label: "$5,500+", description: "Premium tier (21+ pages)" },
      { value: "premium-budget", label: "$8,000+", description: "Complex custom solution" },
      { value: "need-guidance", label: "Need Guidance", description: "Help me understand costs" },
    ],
  },
  {
    id: "companySize",
    question: "How many people work at your company?",
    options: [
      { value: "solo", label: "Just Me", description: "Solopreneur" },
      { value: "2-10", label: "2-10 Employees", description: "Small team" },
      { value: "11-50", label: "11-50 Employees", description: "Mid-size company" },
      { value: "51-200", label: "51-200 Employees", description: "Large company" },
      { value: "200+", label: "200+ Employees", description: "Enterprise" },
    ],
  },
  {
    id: "decisionMaker",
    question: "What's your role in this project?",
    options: [
      { value: "owner", label: "Owner/Founder", description: "I make the final decision" },
      { value: "executive", label: "Executive/C-Level", description: "I have budget authority" },
      { value: "manager", label: "Manager", description: "I'll need approval" },
      { value: "team-member", label: "Team Member", description: "I'm gathering information" },
    ],
  },
];

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

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isMultiSelect = currentQuestion?.multiSelect;

  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      // Handle multi-select toggle
      const newSelected = selectedOptions.includes(value)
        ? selectedOptions.filter(v => v !== value)
        : [...selectedOptions, value];
      setSelectedOptions(newSelected);
    } else {
      // Prevent selection if we're already advancing
      if (isAdvancing) return;

      // Lock selections by setting isAdvancing
      setIsAdvancing(true);

      // Handle single select with auto-advance
      setSelectedOptions([value]);
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);

      // Auto-advance after a short delay for visual feedback
      setTimeout(() => {
        if (currentStep < quizQuestions.length - 1) {
          setCurrentStep(currentStep + 1);
          // Load previous answers for next question if going back
          const nextQuestion = quizQuestions[currentStep + 1];
          const nextAnswer = newAnswers[nextQuestion.id];
          setSelectedOptions(
            Array.isArray(nextAnswer) ? nextAnswer : nextAnswer ? [nextAnswer] : []
          );
          // Unlock selections for next question
          setIsAdvancing(false);
        } else {
          // Quiz complete - show celebration
          setIsCompleted(true);
          setTimeout(() => {
            onComplete(newAnswers);
            // Reset quiz after completion so user can retake
            setTimeout(() => {
              setIsCompleted(false);
              setCurrentStep(0);
              setAnswers({});
              setSelectedOptions([]);
              setIsAdvancing(false);
            }, 500);
          }, 2500);
        }
      }, 400);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    const answerValue = isMultiSelect ? selectedOptions : selectedOptions[0];
    const newAnswers = { ...answers, [currentQuestion.id]: answerValue };
    setAnswers(newAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Load previous answers for next question
      const nextQuestion = quizQuestions[currentStep + 1];
      const nextAnswer = newAnswers[nextQuestion.id];
      setSelectedOptions(
        Array.isArray(nextAnswer) ? nextAnswer : nextAnswer ? [nextAnswer] : []
      );
    } else {
      // Quiz complete - show celebration
      setIsCompleted(true);
      setTimeout(() => {
        onComplete(newAnswers);
        // Reset quiz after completion so user can retake
        setTimeout(() => {
          setIsCompleted(false);
          setCurrentStep(0);
          setAnswers({});
          setSelectedOptions([]);
          setIsAdvancing(false);
        }, 500);
      }, 2500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Reset advancing state when going back
      setIsAdvancing(false);
      setCurrentStep(currentStep - 1);
      const prevQuestion = quizQuestions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id];
      setSelectedOptions(
        Array.isArray(prevAnswer) ? prevAnswer : prevAnswer ? [prevAnswer] : []
      );
    }
  };

  // Show start screen
  if (!hasStarted) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
        <CardContent className="p-8 md:p-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
            >
              Find Your Perfect Solution
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-slate-600 mb-6 max-w-lg mx-auto"
            >
              Answer 12 quick questions to get a personalized recommendation with instant pricing and timeline estimates.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-3 mb-8"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Takes less than 60 seconds</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Get custom pricing estimate</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>See what's included in your solution</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                onClick={() => setHasStarted(true)}
                size="lg"
                className="gap-2 group h-12 px-8"
              >
                Start Quiz Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Show celebration screen when completed
  if (isCompleted) {
    return (
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
        <CardContent className="p-8 md:p-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Quiz Complete! 🎉
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-slate-600 mb-6"
            >
              Great! We're preparing your personalized results...
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex justify-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

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
              <p className="text-slate-600">
                {isMultiSelect
                  ? "Select all that apply, then click Next"
                  : "Select the option that best fits your needs"}
              </p>
            </div>

            {/* Options */}
            <div className={currentQuestion.id === 'desiredFeatures' ? 'grid grid-cols-1 md:grid-cols-2 gap-3 mb-8' : 'space-y-3 mb-8'}>
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptions.includes(option.value);
                const isDisabled = !isMultiSelect && isAdvancing;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    disabled={isDisabled}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                      }
                      ${isDisabled ? "cursor-not-allowed opacity-60" : ""}
                    `}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        w-5 h-5 ${isMultiSelect ? 'rounded' : 'rounded-full'} border-2 flex items-center justify-center mt-0.5 flex-shrink-0
                        ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-slate-300"
                        }
                      `}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={isMultiSelect ? "text-white text-xs" : "w-2 h-2 bg-white rounded-full"}
                          >
                            {isMultiSelect && "✓"}
                          </motion.div>
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
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {currentStep > 0 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            onClick={handleNext}
            disabled={selectedOptions.length === 0}
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
