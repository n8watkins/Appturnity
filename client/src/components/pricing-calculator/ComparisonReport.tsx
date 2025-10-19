/**
 * Comparison Report Component
 *
 * Shows side-by-side comparison of one-time vs monthly SaaS costs
 */

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FeatureWithEnabled, TierInfo, ROIInfo } from "./pricingCalculatorUtils";

interface ComparisonReportProps {
  tierInfo: TierInfo;
  features: FeatureWithEnabled[];
  pages: number;
  users: number;
  totalPrice: number;
  saasMonthlyTotal: number;
  roiInfo: ROIInfo;
  prefilledFromQuiz: boolean;
  quizDiscount: number;
  quizDiscountPercent: number;
  onGetQuote: () => void;
  onAdjust: () => void;
}

export function ComparisonReport({
  tierInfo,
  features,
  pages,
  users,
  totalPrice,
  saasMonthlyTotal,
  roiInfo,
  prefilledFromQuiz,
  quizDiscount,
  quizDiscountPercent,
  onGetQuote,
  onAdjust,
}: ComparisonReportProps) {
  const { basePrice, pageTier, includedAdvancedFeatures } = tierInfo;

  const advancedFeatures = features.filter((f) => f.enabled && f.price > 0);
  const sortedByPrice = [...advancedFeatures].sort((a, b) => a.price - b.price);

  const includedFeatures = sortedByPrice.filter((f, index) => {
    const isIncluded = includedAdvancedFeatures !== Infinity && index < includedAdvancedFeatures;
    const allIncluded = includedAdvancedFeatures === Infinity;
    return isIncluded || allIncluded;
  });

  const paidFeatures = sortedByPrice.filter((f, index) => {
    const isIncluded = includedAdvancedFeatures !== Infinity && index < includedAdvancedFeatures;
    const allIncluded = includedAdvancedFeatures === Infinity;
    return !isIncluded && !allIncluded;
  });

  const tierBases = {
    Essential: 750,
    Professional: 1700,
    Growth: 2450,
    Premium: tierInfo.basePrice, // Use dynamic price from tierInfo
  };

  return (
    <motion.div
      key="comparison"
      id="savings-comparison"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center text-sm text-slate-600 mb-6">
        Here's your customized quote vs monthly subscriptions
      </p>

      {/* Side by Side Comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Our Solution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-5 w-5 text-green-600" />
            <h4 className="text-lg font-bold text-green-900">Appturnity Solution</h4>
          </div>

          {/* Itemized Costs */}
          <div className="space-y-2 mb-4 text-sm flex-grow">
            <div className="flex justify-between">
              <span className="text-green-800">
                {pageTier} Plan ({pages} {pages === 1 ? "page" : "pages"}):
              </span>
              <span className="font-semibold text-green-900">
                ${tierBases[pageTier as keyof typeof tierBases].toLocaleString()}
              </span>
            </div>

            {/* Advanced features */}
            {includedFeatures.length > 0 &&
              includedFeatures.map((f) => (
                <div key={f.id} className="flex justify-between text-xs">
                  <span className="text-green-700">• {f.name} (included)</span>
                  <span className="text-green-600 line-through">${f.price}</span>
                </div>
              ))}
            {paidFeatures.length > 0 &&
              paidFeatures.map((f) => (
                <div key={f.id} className="flex justify-between text-xs">
                  <span className="text-green-700">• {f.name}</span>
                  <span className="text-green-900 font-semibold">+${f.price}</span>
                </div>
              ))}

            {/* Quiz discount */}
            {prefilledFromQuiz && quizDiscount > 0 && (
              <div className="flex justify-between text-xs bg-yellow-100 p-1.5 rounded -mx-1">
                <span className="text-yellow-900 font-semibold">
                  🎉 Quiz Discount ({quizDiscountPercent}%):
                </span>
                <span className="text-yellow-900 font-bold">-${quizDiscount}</span>
              </div>
            )}

            <div className="border-t border-green-300 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-green-900">Total (one-time):</span>
                <div className="text-right">
                  {prefilledFromQuiz && quizDiscount > 0 && (
                    <div className="text-xs text-green-700 line-through mr-2 inline">
                      ${basePrice.toLocaleString()}
                    </div>
                  )}
                  <span className="text-green-900 text-lg">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-green-800">Monthly cost:</span>
                <span className="font-bold text-green-900">$0</span>
              </div>
            </div>
          </div>

          <div className="border-t border-green-300 pt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
              <Check className="h-3.5 w-3.5" /> You own the code
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
              <Check className="h-3.5 w-3.5" /> Unlimited users
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
              <Check className="h-3.5 w-3.5" /> No monthly fees
            </span>
          </div>
        </motion.div>

        {/* Monthly SaaS Alternative */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-300 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <X className="h-5 w-5 text-red-600" />
            <h4 className="text-lg font-bold text-red-900">Monthly SaaS Platforms</h4>
          </div>

          <div className="space-y-2 mb-4 text-sm flex-grow">
            <div className="flex justify-between">
              <span className="text-red-800">
                Website builder ({pages} {pages === 1 ? "page" : "pages"}):
              </span>
              <span className="font-semibold text-red-900">$29/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-800">Team users ({users} users):</span>
              <span className="font-semibold text-red-900">${15 * users}/mo</span>
            </div>

            {features
              .filter((f) => f.enabled && f.saasMonthly)
              .map((f) => (
                <div key={f.id} className="flex justify-between text-xs">
                  <span className="text-red-700">• {f.name}</span>
                  <span className="text-red-900 font-semibold">${f.saasMonthly}/mo</span>
                </div>
              ))}

            <div className="border-t border-red-300 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-red-900">Per month:</span>
                <span className="text-red-900 text-lg">
                  ${saasMonthlyTotal.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-red-800">Per year:</span>
                <span className="font-bold text-red-900">
                  ${(saasMonthlyTotal * 12).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-red-300 pt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
              <X className="h-3.5 w-3.5" /> Platform lock-in
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
              <X className="h-3.5 w-3.5" /> Per-user fees
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
              <X className="h-3.5 w-3.5" /> Ongoing costs
            </span>
          </div>
        </motion.div>
      </div>

      {/* Savings Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl text-white mb-6 text-center"
      >
        <p className="text-sm mb-2">Your Savings vs. Monthly Subscriptions</p>
        <p className="text-4xl font-bold mb-2">
          ${roiInfo.yearOneSavings > 0 ? roiInfo.yearOneSavings.toLocaleString() : "0"}
        </p>
        <p className="text-sm opacity-90">in the first year alone</p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div>
            <p className="opacity-90">3-Year Savings</p>
            <p className="text-xl font-bold">${roiInfo.threeYearSavings.toLocaleString()}</p>
          </div>
          <div>
            <p className="opacity-90">5-Year Savings</p>
            <p className="text-xl font-bold">${roiInfo.fiveYearSavings.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onGetQuote} size="lg" className="flex-1">
          Get Your Quote
        </Button>
        <Button onClick={onAdjust} variant="outline" size="lg" className="flex-1">
          Adjust Configuration
        </Button>
      </div>
    </motion.div>
  );
}
