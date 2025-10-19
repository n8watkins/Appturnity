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
    <div className="md:sticky md:top-4 md:self-start space-y-6">
      {/* Our Recommendation Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-bold text-green-900 flex items-center gap-2">
            <Check className="h-6 w-6 text-green-600" />
            Our Recommendation
          </h4>
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {pageTier} Plan
          </div>
        </div>
        <p className="text-sm text-green-700 mb-4 font-medium">
          Best value for your needs • Pay once, own forever
        </p>

        <div className="space-y-1.5 text-base text-green-900">
          {/* Plan Tier with Details */}
          <div className="bg-green-100/50 rounded-lg p-2.5 border border-green-200">
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-base font-semibold text-green-900">{pageTier} Plan</span>
              <motion.span
                key={`our-pages-${basePrice}`}
                initial={{ color: "#15803d" }}
                animate={{ color: "#14532d" }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold ml-2 whitespace-nowrap"
              >
                ${basePrice.toLocaleString()}
              </motion.span>
            </div>
            <div className="space-y-0.5 text-xs text-green-700 ml-2.5">
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

          {/* Users - Unlimited */}
          <div className="flex justify-between items-start py-0.5">
            <span className="text-sm flex-grow">
              {users} {users === 1 ? "User" : "Users"}{" "}
              <span className="text-green-700 text-xs">(no per-user fees)</span>
            </span>
            <span className="text-base font-bold ml-2 whitespace-nowrap text-green-700">
              Unlimited
            </span>
          </div>

          {/* Feature Breakdown */}
          <FeatureBreakdown
            features={features}
            includedAdvancedFeatures={includedAdvancedFeatures}
          />

          {/* Total with Quiz Discount */}
          <div className="border-t-2 border-green-300 pt-3 mt-3">
            {prefilledFromQuiz && quizDiscount > 0 && (
              <div className="mb-3 p-2.5 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border border-yellow-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <span className="text-sm font-semibold text-yellow-900">
                      Quiz Completion Discount ({quizDiscountPercent}%)
                    </span>
                  </div>
                  <span className="text-base font-bold text-yellow-900">
                    -${quizDiscount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-green-900">One-Time Investment:</span>
              <div className="text-right">
                {prefilledFromQuiz && quizDiscount > 0 && (
                  <div className="text-sm text-green-700 line-through mb-1">
                    ${basePrice.toLocaleString()}
                  </div>
                )}
                <PriceDisplay price={totalPrice} size="lg" />
              </div>
            </div>
            <p className="text-sm text-green-700 text-right">Timeline: {timeline}</p>
          </div>

          {/* Benefits */}
          <div className="pt-3 border-t border-green-300 space-y-2 text-sm text-green-800">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Unlimited users - no extra charge
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Full source code ownership
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" /> No monthly payments
            </p>
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Free updates & maintenance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
