/**
 * Feature Breakdown Component
 *
 * Displays a list of features separated into included and paid add-ons
 */

import type { FeatureWithEnabled } from "./pricingCalculatorUtils";

interface FeatureBreakdownProps {
  features: FeatureWithEnabled[];
  includedAdvancedFeatures: number;
}

export function FeatureBreakdown({ features, includedAdvancedFeatures }: FeatureBreakdownProps) {
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

  return (
    <>
      {/* Included Add-ons */}
      {includedFeatures.length > 0 && (
        <div className="space-y-1">
          {includedFeatures.map((f) => (
            <div key={f.id} className="flex justify-between items-start py-0.5">
              <span className="text-sm flex-grow">
                {f.name}
                <span className="text-green-700 text-xs ml-1">(included)</span>
              </span>
              <span className="text-base font-semibold ml-2 whitespace-nowrap line-through text-green-600">
                ${f.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Additional Add-ons */}
      {paidFeatures.length > 0 && (
        <>
          <div className="border-t border-green-300 my-2 pt-2">
            <p className="text-xs font-semibold text-green-800 mb-1">Additional Add-ons:</p>
          </div>
          <div className="space-y-1">
            {paidFeatures.map((f) => (
              <div key={f.id} className="flex justify-between items-start py-0.5">
                <span className="text-sm flex-grow">{f.name}</span>
                <span className="text-base font-semibold ml-2 whitespace-nowrap">
                  +${f.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
