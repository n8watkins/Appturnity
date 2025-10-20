/**
 * Quiz Exit-Intent Modal Component
 *
 * Exit-intent/abandonment capture modal triggered when user scrolls away from quiz.
 * Uses a two-step flow: qualifying question → contact capture with discount offer.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Gift, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const exitModalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ExitModalFormValues = z.infer<typeof exitModalSchema>;

interface QuizExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => void;
  onContinueQuiz?: () => void;
}

export default function QuizExitModal({
  isOpen,
  onClose,
  onSubmit,
  onContinueQuiz,
}: QuizExitModalProps) {
  const [step, setStep] = useState<"qualifying" | "contact">("qualifying");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { toast } = useToast();

  const form = useForm<ExitModalFormValues>({
    resolver: zodResolver(exitModalSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleYes = () => {
    setStep("contact");
  };

  const handleFormSubmit = async (data: ExitModalFormValues) => {
    if (!executeRecaptcha) {
      toast({
        title: "reCAPTCHA not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Execute reCAPTCHA to get token
      const recaptchaToken = await executeRecaptcha("quiz_exit_modal");

      // Submit with reCAPTCHA token
      await onSubmit({
        name: data.name.trim(),
        email: data.email.trim(),
      });

      // Reset state
      setStep("qualifying");
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your information couldn't be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep("qualifying");
    form.reset();
    onClose();
  };

  const handleContinueQuiz = () => {
    // Close modal and continue quiz
    handleClose();
    if (onContinueQuiz) {
      onContinueQuiz();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {step === "qualifying" ? (
              <motion.div
                key="qualifying"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="space-y-2 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <DialogTitle className="text-lg sm:text-xl font-bold leading-tight mb-1.5">
                        Wait! Don't Miss Your 10% Discount
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-snug">
                        Most people waste{" "}
                        <span className="font-semibold text-slate-900">weeks researching</span> and
                        still choose wrong.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="mb-4">
                  {/* Main CTA Box */}
                  <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-primary/5 border-2 border-primary/30 rounded-lg p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-start gap-2.5 mb-3">
                      <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                          Get a Personalized Plan + Save 10%
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          We'll recommend the <span className="font-semibold">exact solution</span>{" "}
                          for your needs—no fluff, no upselling.
                        </p>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-1.5">
                      {[
                        "Custom recommendation for your project",
                        "Honest pricing (no hidden costs)",
                        "10% discount code included",
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleYes}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 gap-2 shadow-lg text-sm h-10 sm:h-11"
                  >
                    <span>Yes! Send My Plan + Discount</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleContinueQuiz}
                      variant="outline"
                      className="flex-1 text-slate-700 hover:text-slate-900 text-sm h-10 sm:h-11"
                    >
                      Continue Quiz
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="ghost"
                      className="flex-1 text-slate-600 hover:text-slate-900 text-sm h-10 sm:h-11"
                    >
                      No Thanks
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="space-y-2 mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <DialogTitle className="text-lg sm:text-xl font-bold leading-tight mb-1.5">
                        Perfect! Where Should We Send It?
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm text-slate-600">
                        Your plan + 10% discount code arrives within 24 hours.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-10 text-sm"
                              autoFocus
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="h-10 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Trust Badge */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                      <p className="text-xs text-green-800 text-center">
                        <Gift className="inline h-3.5 w-3.5 mr-1" />
                        Your 10% discount code will be included
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg text-sm h-10 sm:h-11"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                          </span>
                        ) : (
                          "Get My Plan + Discount"
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleClose}
                        variant="ghost"
                        disabled={isSubmitting}
                        className="text-slate-600 hover:text-slate-900 text-sm h-10 sm:h-11"
                      >
                        Cancel
                      </Button>
                    </div>

                    {/* reCAPTCHA Notice */}
                    <div className="text-center pt-1">
                      <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <span>🛡️</span>
                        <span>Protected by reCAPTCHA v3</span>
                      </div>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
