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

        return (
          <div key={category}>
            {isAlwaysIncluded ? (
              /* Desktop only: Original grid layout (mobile is in PricingCalculator) */
              <>
                <div className="hidden sm:block">
                  <div className="mb-4">
                    <div className="pb-2 border-b border-emerald-500/30">
                      <h3 className="text-lg font-bold text-emerald-700">✓ INCLUDED ALWAYS</h3>
                      <p className="text-xs text-emerald-600 mt-1">
                        Essential features competitors charge $19+/month for
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
                    {categoryFeatures.map((feature, index) => (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        onToggle={() => onToggleFeature(feature.id)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Advanced Features section */
              <>
                <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 lg:mt-8">
                  <div className="pb-2 border-b border-slate-300">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
                      ADD MORE POWER
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Click to add features that take your site further
                    </p>
                  </div>
                </div>

                {/* Features Grid - responsive: 2 cols mobile, 2 cols tablet, 3 cols desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
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
            )}
          </div>
        );
      })}
    </div>
  );
}
