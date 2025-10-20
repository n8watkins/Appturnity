/**
 * Feature Grid Component
 *
 * Displays features organized by category with selection functionality
 */

import { Check } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import type { FeatureWithEnabled } from "./pricingCalculatorUtils";

interface FeatureCategory {
  name: string;
  features: FeatureWithEnabled[];
}

interface FeatureGridProps {
  featuresByCategory: Record<string, FeatureWithEnabled[]>;
  onToggleFeature: (featureId: string) => void;
}

export function FeatureGrid({ featuresByCategory, onToggleFeature }: FeatureGridProps) {
  return (
    <div className="space-y-6">
      {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
        const isAlwaysIncluded = category === "Always Included";

        // Skip "Always Included" - it's handled separately in PricingCalculator
        if (isAlwaysIncluded) {
          return null;
        }

        return (
          <div key={category}>
            {/* Advanced Features section */}
            <>
              <div className="mb-4 sm:mb-5">
                <div className="pb-3 border-b-2 border-slate-300">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                    ADD MORE POWER
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
                    Click to add features that take your site further
                  </p>
                </div>
              </div>

              {/* Features Grid - responsive: 2 cols mobile, 3 cols tablet, 3 cols desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {categoryFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onToggle={() => onToggleFeature(feature.id)}
                    index={index}
                  />
                ))}
              </div>
            </>
          </div>
        );
      })}
    </div>
  );
}
