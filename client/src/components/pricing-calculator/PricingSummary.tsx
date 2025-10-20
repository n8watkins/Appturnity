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

  // Check if user has made any selections (quiz or manual feature selection)
  const hasAdvancedFeaturesSelected = features.some((f) => f.enabled && !f.isAlwaysIncluded);
  const showRecommendation = prefilledFromQuiz || hasAdvancedFeaturesSelected;

  return (
    <div
      className={`md:sticky md:top-4 md:self-start space-y-3 sm:space-y-4 ${
        showRecommendation
          ? "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-2 border-green-300"
          : "bg-white border-2 border-slate-200"
      } rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg`}
    >
      {/* Our Recommendation Header - Only show if quiz taken or features selected */}
      {showRecommendation && (
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
              <Check className="h-3.5 w-3.5 text-white flex-shrink-0" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-green-900 tracking-tight">
              Our Recommendation
            </h4>
          </div>
        </div>
      )}

      {/* Plan Details Card */}
      <div
        className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md ${
          showRecommendation ? "border-2 border-green-400" : "border border-slate-300"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-base sm:text-lg font-bold text-slate-900">{pageTier} Plan</span>
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ${basePrice.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2 text-sm sm:text-base text-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="font-medium">{getPageRange(pageTier)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="font-medium">
              {getFeatureCount()} advanced {includedAdvancedFeatures === 1 ? "feature" : "features"}{" "}
              included
            </span>
          </div>
        </div>
      </div>

      {/* Feature Breakdown */}
      <FeatureBreakdown features={features} includedAdvancedFeatures={includedAdvancedFeatures} />

      {/* Total Price with optional discount */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-5 border-2 border-slate-300 shadow-md">
        <div className="space-y-2">
          {/* Quiz Discount Line Item */}
          {prefilledFromQuiz && quizDiscount > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-base">🎉</span>
                <span className="text-sm sm:text-base font-semibold text-yellow-600">
                  Quiz Discount ({quizDiscountPercent}%)
                </span>
              </div>
              <span className="text-sm sm:text-base font-bold text-yellow-600">
                -${quizDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Total Investment */}
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-bold text-slate-900">
              One-Time Investment
            </span>
            <div className="text-right">
              <PriceDisplay price={totalPrice} size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
