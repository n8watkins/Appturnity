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
import { Check } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";
import { getQuizResults } from "@/lib/quizStorage";
import { ALWAYS_INCLUDED_FEATURES, OPTIONAL_FEATURES } from "@/lib/pricing";
import type { Feature as PricingFeature } from "@/lib/pricing";

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
            (data.desiredFeatures as string[]).includes(feature.id) || feature.isAlwaysIncluded,
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
    handleSmoothScroll(new Event("click") as MouseEvent, "pricing-tiers", undefined, true);
  };

  const handleLockInQuote = () => {
    handleSmoothScroll(new Event("click") as MouseEvent, "contact", undefined, true);
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
          <Card className="shadow-lg border border-slate-300 bg-white">
            <CardContent className="p-3 sm:p-5 md:p-6 lg:p-8">
              <div className="grid md:grid-cols-[2fr_1fr] gap-4 sm:gap-6 md:gap-8">
                {/* Left Column */}
                <div>
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">
                    Configure Your Project
                  </h3>

                  {/* Mobile: 2-column layout (Included Always + Sliders) */}
                  <div className="sm:hidden grid grid-cols-2 gap-2 mb-4">
                    {/* Left: Included Always */}
                    <div>
                      {featuresByCategory["Always Included"] && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                              <Check className="h-2 w-2 text-white" />
                            </div>
                            <h3 className="text-xs font-bold text-emerald-800 uppercase">
                              Included Always
                            </h3>
                          </div>
                          <div className="space-y-0.5">
                            {featuresByCategory["Always Included"].map((feature) => (
                              <div key={feature.id} className="text-xs text-emerald-700">
                                • {feature.shortName || feature.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Pages + Users sliders stacked */}
                    <div className="space-y-2">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Pages
                        </label>
                        <span className="text-base font-bold text-slate-900 block mb-1">
                          {pages}
                        </span>
                        <Slider
                          value={[pages]}
                          onValueChange={(value) => onPagesChange(value[0])}
                          min={1}
                          max={20}
                          step={1}
                        />
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Users
                        </label>
                        <span className="text-base font-bold text-slate-900 block mb-1">
                          {users}
                        </span>
                        <Slider
                          value={[users]}
                          onValueChange={(value) => onUsersChange(value[0])}
                          min={1}
                          max={20}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop: Original layout */}
                  <div className="hidden sm:block">
                    <FeatureSliders
                      pages={pages}
                      users={users}
                      onPagesChange={setPages}
                      onUsersChange={setUsers}
                    />
                  </div>

                  <FeatureGrid
                    featuresByCategory={featuresByCategory}
                    onToggleFeature={toggleFeature}
                  />
                </div>

                {/* Right Column */}
                <div>
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
                    <Button onClick={handleLockInQuote} size="lg" className="w-full">
                      Lock in Your Quote Now
                    </Button>
                    <Button
                      onClick={handleSeePricingOptions}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      See Pricing Options
                    </Button>
                    <p className="text-center text-xs text-slate-500 mt-1.5 sm:mt-2">
                      No commitment • Free consultation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
