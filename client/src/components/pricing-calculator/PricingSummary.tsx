/**
 * Pricing Summary Component
 *
 * Right sidebar showing pricing breakdown, tier info, and total
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FeatureBreakdown } from "./FeatureBreakdown";
import { PriceDisplay } from "./PriceDisplay";
import type { FeatureWithEnabled, TierInfo } from "./pricingCalculatorUtils";

interface PricingSummaryProps {
  tierInfo: TierInfo;
  features: FeatureWithEnabled[];
  users: number;
  totalPrice: number;
  totalPriceBeforeDiscount: number;
  timeline: string;
  prefilledFromQuiz: boolean;
  quizDiscount?: number;
  quizDiscountPercent?: number;
}

export function PricingSummary({
  tierInfo,
  features,
  users,
  totalPrice,
  totalPriceBeforeDiscount,
  timeline,
  prefilledFromQuiz,
  quizDiscount = 0,
  quizDiscountPercent = 10,
}: PricingSummaryProps) {
  const { basePrice, pageTier, includedAdvancedFeatures } = tierInfo;

  const getPageRange = (tier: string) => {
    switch (tier) {
      case "Essential":
        return "1-5 pages";
      case "Professional":
        return "6-12 pages";
      case "Enterprise":
        return "13-20 pages";
      case "Premium":
        return "20+ pages";
      default:
        return "";
    }
  };

  const getFeatureCount = () => {
    if (includedAdvancedFeatures === Infinity) return "Unlimited";
    return includedAdvancedFeatures.toString();
  };

  return (
    <div className="md:sticky md:top-4 md:self-start space-y-3 sm:space-y-4">
      {/* Our Recommendation Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 border-green-300">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
          <h4 className="text-base sm:text-lg lg:text-xl font-bold text-green-900">
            Our Recommendation
          </h4>
        </div>

        {/* Total Price (Prominent) */}
        <div className="mb-3 sm:mb-4">
          {prefilledFromQuiz && quizDiscount > 0 && (
            <div className="mb-2 p-2 sm:p-2.5 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border border-yellow-300">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">🎉</span>
                  <span className="text-xs sm:text-sm font-semibold text-yellow-900">
                    Quiz Discount ({quizDiscountPercent}%)
                  </span>
                </div>
                <span className="text-sm sm:text-base font-bold text-yellow-900">
                  -${quizDiscount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base lg:text-lg font-bold text-green-900">
              One-Time Investment:
            </span>
            <div className="text-right">
              {prefilledFromQuiz && quizDiscount > 0 && (
                <div className="text-xs sm:text-sm text-green-700 line-through mb-0.5 sm:mb-1">
                  ${totalPriceBeforeDiscount.toLocaleString()}
                </div>
              )}
              <PriceDisplay price={totalPrice} size="lg" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-700 text-right mt-1">Timeline: {timeline}</p>
        </div>

        {/* Plan Details - Compact */}
        <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-green-900">
          {/* Plan Tier - Smaller */}
          <div className="bg-green-100/50 rounded-md sm:rounded-lg p-2 sm:p-2.5 border border-green-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-semibold text-green-900">
                {pageTier} Plan
              </span>
              <span className="text-sm sm:text-base font-bold text-green-800">
                ${basePrice.toLocaleString()}
              </span>
            </div>
            <div className="space-y-0.5 text-xs text-green-700">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-600"></div>
                <span>{getPageRange(pageTier)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-600"></div>
                <span>
                  {getFeatureCount()} advanced{" "}
                  {includedAdvancedFeatures === 1 ? "feature" : "features"} included
                </span>
              </div>
            </div>
          </div>

          {/* Feature Breakdown */}
          <FeatureBreakdown
            features={features}
            includedAdvancedFeatures={includedAdvancedFeatures}
          />

          {/* Benefits - Compact */}
          <div className="pt-2 sm:pt-3 border-t border-green-300 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-green-800">
            <p className="flex items-center gap-1.5 sm:gap-2">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> Unlimited users
            </p>
            <p className="flex items-center gap-1.5 sm:gap-2">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> Full code ownership
            </p>
            <p className="flex items-center gap-1.5 sm:gap-2">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> No monthly fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
