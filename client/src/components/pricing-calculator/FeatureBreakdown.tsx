/**
 * Feature Breakdown Component
 *
 * Displays a list of features separated into included and paid add-ons
 * All features cost $500 flat
 */

import type { FeatureWithEnabled } from "./pricingCalculatorUtils";

interface FeatureBreakdownProps {
  features: FeatureWithEnabled[];
  includedAdvancedFeatures: number;
}

const FEATURE_PRICE = 500; // All advanced features cost $500

export function FeatureBreakdown({ features, includedAdvancedFeatures }: FeatureBreakdownProps) {
  const advancedFeatures = features.filter((f) => f.enabled && f.price > 0);

  // No need to sort by price since all cost the same
  const includedFeatures = advancedFeatures.filter((f, index) => {
    const isIncluded = includedAdvancedFeatures !== Infinity && index < includedAdvancedFeatures;
    const allIncluded = includedAdvancedFeatures === Infinity;
    return isIncluded || allIncluded;
  });

  const paidFeatures = advancedFeatures.filter((f, index) => {
    const isIncluded = includedAdvancedFeatures !== Infinity && index < includedAdvancedFeatures;
    const allIncluded = includedAdvancedFeatures === Infinity;
    return !isIncluded && !allIncluded;
  });

  return (
    <>
      {/* Included Add-ons */}
      {includedFeatures.length > 0 && (
        <div className="space-y-1.5">
          {includedFeatures.map((f) => (
            <div key={f.id} className="flex justify-between items-start py-1">
              <span className="text-sm flex-grow font-medium text-slate-900">{f.name}</span>
              <span className="text-sm font-bold ml-2 whitespace-nowrap line-through text-green-600">
                ${FEATURE_PRICE.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Additional Add-ons */}
      {paidFeatures.length > 0 && (
        <>
          <div className="border-t-2 border-green-300 my-3 pt-2.5">
            <p className="text-xs font-bold text-green-900 mb-1.5 uppercase tracking-wide">
              Additional Add-ons:
            </p>
          </div>
          <div className="space-y-1.5">
            {paidFeatures.map((f) => (
              <div key={f.id} className="flex justify-between items-start py-1">
                <span className="text-sm flex-grow font-medium text-slate-900">{f.name}</span>
                <span className="text-sm font-bold ml-2 whitespace-nowrap text-slate-900">
                  +${FEATURE_PRICE.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
