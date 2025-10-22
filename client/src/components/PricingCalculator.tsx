/**
 * Project Builder Component (Refactored)
 *
 * Interactive project configurator for custom quotes.
 * Reduced from 1412 lines to ~250 lines through component extraction.
 */

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";
import { getQuizResults } from "@/lib/quizStorage";
import { ALWAYS_INCLUDED_FEATURES, OPTIONAL_FEATURES } from "@/lib/pricing";
import type { Feature as PricingFeature } from "@/lib/pricing";
import { motion, AnimatePresence } from "framer-motion";

import {
  PricingCalculatorHeader,
  FeatureSliders,
  FeatureGrid,
  PricingSummary,
  calculateTierInfo,
  calculateTotalPrice,
  calculateOptimalTier,
  type FeatureWithEnabled,
} from "./pricing-calculator";

// Quiz discount percentage
const QUIZ_DISCOUNT_PERCENT = 10;

// Convert pricing features to calculator features with enabled flag
const FEATURES: FeatureWithEnabled[] = [
  ...ALWAYS_INCLUDED_FEATURES.map((f) => ({ ...f, enabled: true })),
  ...OPTIONAL_FEATURES.map((f) => ({ ...f, enabled: false })),
];

export default function PricingCalculator() {
  // State
  const [pages, setPages] = useState(5);
  const [users, setUsers] = useState(3);
  const [features, setFeatures] = useState<FeatureWithEnabled[]>(FEATURES);
  const [prefilledFromQuiz, setPrefilledFromQuiz] = useState(false);
  const [showPricingEstimate, setShowPricingEstimate] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculations using utility functions
  const tierInfo = useMemo(() => calculateTierInfo(pages, features), [pages, features]);

  const totalPriceBeforeDiscount = useMemo(
    () => calculateTotalPrice(tierInfo, features),
    [tierInfo, features]
  );

  const totalPrice = useMemo(() => {
    if (prefilledFromQuiz) {
      return Math.round(totalPriceBeforeDiscount * (1 - QUIZ_DISCOUNT_PERCENT / 100));
    }
    return totalPriceBeforeDiscount;
  }, [totalPriceBeforeDiscount, prefilledFromQuiz]);

  const quizDiscount = useMemo(() => {
    if (prefilledFromQuiz) {
      return totalPriceBeforeDiscount - totalPrice;
    }
    return 0;
  }, [totalPriceBeforeDiscount, totalPrice, prefilledFromQuiz]);

  const timeline = useMemo(() => {
    const totalComplexity =
      pages + features.filter((f) => f.enabled && !f.isAlwaysIncluded).length * 2;
    if (totalComplexity <= 10) return "2-3 weeks";
    if (totalComplexity <= 20) return "3-4 weeks";
    if (totalComplexity <= 30) return "4-6 weeks";
    if (totalComplexity <= 50) return "6-8 weeks";
    return "8-12 weeks";
  }, [pages, features]);

  // Calculate optimal tier recommendation (cheapest tier that supports page count)
  const recommendedTier = useMemo(() => {
    const advancedCount = features.filter((f) => f.enabled && !f.isAlwaysIncluded).length;
    return calculateOptimalTier(pages, advancedCount).name;
  }, [pages, features]);

  // Feature management
  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id && !f.isAlwaysIncluded ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const featuresByCategory = useMemo(
    () =>
      features.reduce(
        (acc, feature) => {
          const category = feature.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(feature);
          return acc;
        },
        {} as Record<string, FeatureWithEnabled[]>
      ),
    [features]
  );

  // Quiz prefill logic
  const prefillFromQuiz = (data: Record<string, unknown>) => {
    // Prefill pages from pageCount question
    if (data.pageCount && typeof data.pageCount === "string") {
      const pageRange = data.pageCount;
      let pageValue = 5; // default

      if (pageRange === "1-5") pageValue = 3;
      else if (pageRange === "6-12") pageValue = 9;
      else if (pageRange === "13-20") pageValue = 16;
      else if (pageRange === "20+") pageValue = 25;
      else if (pageRange === "not-sure") pageValue = 8;

      setPages(pageValue);
      setPrefilledFromQuiz(true);
    }

    // Prefill users from teamSize question
    if (data.teamSize && typeof data.teamSize === "string") {
      const teamRange = data.teamSize;
      let userValue = 3; // default

      if (teamRange === "1-3") userValue = 2;
      else if (teamRange === "4-7") userValue = 5;
      else if (teamRange === "8-15") userValue = 10;
      else if (teamRange === "15+") userValue = 15;

      setUsers(userValue);
      setPrefilledFromQuiz(true);
    }

    // Pre-enable features based on quiz
    if (
      data.desiredFeatures &&
      Array.isArray(data.desiredFeatures) &&
      data.desiredFeatures.every((item) => typeof item === "string")
    ) {
      setFeatures((prev) =>
        prev.map((feature) => ({
          ...feature,
          enabled:
            (data.desiredFeatures as string[]).includes(feature.id) ||
            Boolean(feature.isAlwaysIncluded),
        }))
      );
      setPrefilledFromQuiz(true);
    }
  };

  // Effects
  useEffect(() => {
    const quizData = getQuizResults();
    if (quizData) {
      prefillFromQuiz(quizData);
    }
  }, []);

  useEffect(() => {
    const handleQuizCompleted = (event: CustomEvent) => {
      const quizData = event.detail;

      if (!quizData || typeof quizData !== "object") {
        console.warn("Invalid quiz data received");
        return;
      }

      prefillFromQuiz(quizData);
    };

    window.addEventListener("quizCompleted", handleQuizCompleted as EventListener);

    return () => {
      window.removeEventListener("quizCompleted", handleQuizCompleted as EventListener);
    };
  }, []);

  // Dispatch project builder updates and recommended tier
  useEffect(() => {
    if (pages && features.length > 0) {
      const projectData = {
        pages,
        users,
        selectedFeatures: features.filter((f) => f.enabled).map((f) => f.id),
        basePrice: tierInfo.basePrice,
        totalPrice,
        tier: tierInfo.pageTier,
        timeline,
      };

      // Dispatch to pricing section to highlight optimal recommended tier
      window.dispatchEvent(
        new CustomEvent("projectConfigured", {
          detail: {
            recommendedTier: recommendedTier, // Use optimal tier calculation
            totalPrice,
            prefilledFromQuiz,
          },
          bubbles: true,
        })
      );

      // Keep legacy event for any other listeners
      window.dispatchEvent(
        new CustomEvent("calculatorUpdated", {
          detail: projectData,
          bubbles: true,
        })
      );
    }
  }, [pages, users, features, tierInfo, totalPrice, timeline, prefilledFromQuiz, recommendedTier]);

  // Event handlers
  const handleSeePricingOptions = () => {
    handleSmoothScroll(new MouseEvent("click") as any, "pricing-tiers", undefined, true);
  };

  const handleLockInQuote = () => {
    handleSmoothScroll(new MouseEvent("click") as any, "contact", undefined, true);
  };

  const handleSeeEstimate = async () => {
    setIsCalculating(true);
    // Simulate calculation time for a smooth UX
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCalculating(false);
    setShowPricingEstimate(true);
  };

  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 scroll-mt-16"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PricingCalculatorHeader prefilledFromQuiz={prefilledFromQuiz} />

        <div className="max-w-7xl mx-auto">
          <Card className="shadow-2xl border-2 border-slate-200 bg-white backdrop-blur-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
              {/* Mobile only: Standard layout */}
              <div className="sm:hidden">
                {!showPricingEstimate && !isCalculating ? (
                  <div className="grid md:grid-cols-[2fr_1fr] gap-4 sm:gap-6 md:gap-8">
                    {/* Left Column */}
                    <div>
                      <FeatureGrid
                        featuresByCategory={featuresByCategory}
                        onToggleFeature={toggleFeature}
                      />
                    </div>

                    {/* Right Column - CTA */}
                    <div>
                      <motion.div
                        key="cta"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-lg text-center"
                      >
                        <div className="mb-4 flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Ready to see your estimate?
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                          Click features to customize, then view your personalized pricing
                        </p>
                        <Button onClick={handleSeeEstimate} size="lg" className="w-full gap-2">
                          <TrendingUp className="w-4 h-4" />
                          See Quick Estimate
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {isCalculating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 border-2 border-primary/20 rounded-xl p-8 shadow-xl text-center min-h-[400px] flex flex-col items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mb-6"
                        >
                          <Sparkles className="w-16 h-16 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          Calculating Your Estimate
                        </h3>
                        <div className="space-y-3 max-w-xs mx-auto">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            Analyzing selected features
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            Optimizing tier recommendation
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            Preparing your personalized quote
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="estimate"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <PricingSummary
                          tierInfo={tierInfo}
                          features={features}
                          users={users}
                          totalPrice={totalPrice}
                          totalPriceBeforeDiscount={totalPriceBeforeDiscount}
                          timeline={timeline}
                          prefilledFromQuiz={prefilledFromQuiz}
                          quizDiscount={quizDiscount}
                          quizDiscountPercent={QUIZ_DISCOUNT_PERCENT}
                        />

                        {/* Action Buttons */}
                        <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                          <Button
                            onClick={() => setShowPricingEstimate(false)}
                            variant="outline"
                            size="lg"
                            className="w-full bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
                          >
                            Adjust My Estimate
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={handleLockInQuote} size="lg" className="w-full">
                              Lock in Quote
                            </Button>
                            <Button
                              onClick={handleSeePricingOptions}
                              variant="outline"
                              size="lg"
                              className="w-full bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-800"
                            >
                              See More Options
                            </Button>
                          </div>
                          <p className="text-center text-xs text-slate-500 mt-1.5 sm:mt-2">
                            No commitment • Free consultation
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Tablet (sm to lg): Single column layout */}
              <div className="hidden sm:block lg:hidden space-y-5">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 border-2 border-primary/20 rounded-xl p-12 shadow-xl text-center min-h-[500px] flex flex-col items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mb-8"
                      >
                        <Sparkles className="w-20 h-20 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        Calculating Your Estimate
                      </h3>
                      <div className="space-y-4 max-w-md mx-auto">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-3 text-base text-slate-600"
                        >
                          <Check className="w-5 h-5 text-green-600" />
                          Analyzing selected features
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex items-center gap-3 text-base text-slate-600"
                        >
                          <Check className="w-5 h-5 text-green-600" />
                          Optimizing tier recommendation
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 }}
                          className="flex items-center gap-3 text-base text-slate-600"
                        >
                          <Check className="w-5 h-5 text-green-600" />
                          Preparing your personalized quote
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : showPricingEstimate ? (
                    <motion.div
                      key="estimate"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <PricingSummary
                        tierInfo={tierInfo}
                        features={features}
                        users={users}
                        totalPrice={totalPrice}
                        totalPriceBeforeDiscount={totalPriceBeforeDiscount}
                        timeline={timeline}
                        prefilledFromQuiz={prefilledFromQuiz}
                        quizDiscount={quizDiscount}
                        quizDiscountPercent={QUIZ_DISCOUNT_PERCENT}
                      />

                      {/* Action Buttons */}
                      <div className="space-y-2 mt-5">
                        <Button
                          onClick={() => setShowPricingEstimate(false)}
                          variant="outline"
                          size="lg"
                          className="w-full bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
                        >
                          Adjust My Estimate
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={handleLockInQuote} size="lg" className="w-full">
                            Lock in Quote
                          </Button>
                          <Button
                            onClick={handleSeePricingOptions}
                            variant="outline"
                            size="lg"
                            className="w-full bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-800"
                          >
                            See More Options
                          </Button>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-1.5">
                          No commitment • Free consultation
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {/* Advanced Features - Full Width */}
                      <FeatureGrid
                        featuresByCategory={featuresByCategory}
                        onToggleFeature={toggleFeature}
                      />

                      {/* CTA */}
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-lg text-center">
                        <div className="mb-4 flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Ready to see your estimate?
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                          Click features to customize, then view your personalized pricing
                        </p>
                        <Button onClick={handleSeeEstimate} size="lg" className="w-full gap-2">
                          <TrendingUp className="w-4 h-4" />
                          See Quick Estimate
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop (lg+): 4-column layout */}
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  {isCalculating || showPricingEstimate ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {isCalculating ? (
                        <div className="bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 border-2 border-primary/20 rounded-xl p-16 shadow-xl text-center min-h-[500px] flex flex-col items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mb-8"
                          >
                            <Sparkles className="w-24 h-24 text-primary" />
                          </motion.div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-6">
                            Calculating Your Estimate
                          </h3>
                          <div className="space-y-4 max-w-lg">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="flex items-center gap-3 text-lg text-slate-600"
                            >
                              <Check className="w-6 h-6 text-green-600" />
                              Analyzing selected features
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 }}
                              className="flex items-center gap-3 text-lg text-slate-600"
                            >
                              <Check className="w-6 h-6 text-green-600" />
                              Optimizing tier recommendation
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 }}
                              className="flex items-center gap-3 text-lg text-slate-600"
                            >
                              <Check className="w-6 h-6 text-green-600" />
                              Preparing your personalized quote
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <PricingSummary
                            tierInfo={tierInfo}
                            features={features}
                            users={users}
                            totalPrice={totalPrice}
                            totalPriceBeforeDiscount={totalPriceBeforeDiscount}
                            timeline={timeline}
                            prefilledFromQuiz={prefilledFromQuiz}
                            quizDiscount={quizDiscount}
                            quizDiscountPercent={QUIZ_DISCOUNT_PERCENT}
                          />

                          <div className="space-y-3">
                            <Button
                              onClick={() => setShowPricingEstimate(false)}
                              variant="outline"
                              size="lg"
                              className="w-full bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
                            >
                              Adjust My Estimate
                            </Button>
                            <div className="grid grid-cols-2 gap-3">
                              <Button onClick={handleLockInQuote} size="lg" className="w-full">
                                Lock in Quote
                              </Button>
                              <Button
                                onClick={handleSeePricingOptions}
                                variant="outline"
                                size="lg"
                                className="w-full bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-800"
                              >
                                See More Options
                              </Button>
                            </div>
                            <p className="text-center text-xs text-slate-500 mt-1.5">
                              No commitment • Free consultation
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Advanced Features - Full Width */}
                      <FeatureGrid
                        featuresByCategory={featuresByCategory}
                        onToggleFeature={toggleFeature}
                      />

                      {/* CTA - Full Width */}
                      <div className="bg-white border-2 border-slate-200 rounded-xl p-8 shadow-lg text-center max-w-2xl mx-auto">
                        <div className="mb-6 flex justify-center">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-10 h-10 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                          Ready to see your estimate?
                        </h3>
                        <p className="text-base text-slate-600 mb-6">
                          Click features to customize, then view your personalized pricing
                        </p>
                        <Button onClick={handleSeeEstimate} size="lg" className="w-full gap-2">
                          <TrendingUp className="w-5 h-5" />
                          See Quick Estimate
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
