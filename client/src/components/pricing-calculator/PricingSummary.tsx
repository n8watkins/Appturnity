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
    <div className="md:sticky md:top-4 md:self-start space-y-3 sm:space-y-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
      {/* Our Recommendation Header */}
      <div>
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
          <h4 className="text-lg sm:text-xl font-bold text-green-900">Our Recommendation</h4>
        </div>
      </div>

      {/* Plan Details Card - Green Border */}
      <div className="bg-white rounded-lg sm:rounded-xl border-2 border-green-400 p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base sm:text-lg font-bold text-slate-900">{pageTier} Plan</span>
          <span className="text-xl sm:text-2xl font-bold text-green-600">
            ${basePrice.toLocaleString()}
          </span>
        </div>
        <div className="space-y-1.5 text-sm sm:text-base text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            <span>{getPageRange(pageTier)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            <span>
              {getFeatureCount()} advanced {includedAdvancedFeatures === 1 ? "feature" : "features"}{" "}
              included
            </span>
          </div>
        </div>
      </div>

      {/* Feature Breakdown */}
      <FeatureBreakdown features={features} includedAdvancedFeatures={includedAdvancedFeatures} />

      {/* Quiz Discount */}
      {prefilledFromQuiz && quizDiscount > 0 && (
        <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border border-yellow-300">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span className="text-sm sm:text-base font-semibold text-yellow-900">
                Quiz Discount ({quizDiscountPercent}%)
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-yellow-900">
              -${quizDiscount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Total Price */}
      <div className="bg-slate-50 rounded-lg p-4 sm:p-5 border border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-bold text-slate-900">One-Time Investment</span>
          <div className="text-right">
            {prefilledFromQuiz && quizDiscount > 0 && (
              <div className="text-sm text-slate-500 line-through mb-1">
                ${totalPriceBeforeDiscount.toLocaleString()}
              </div>
            )}
            <PriceDisplay price={totalPrice} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
