/**
 * Feature Grid Component
 *
 * Displays features organized by category with selection functionality
 */

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
            {/* Section Header */}
            {isAlwaysIncluded ? (
              <div className="mb-3 sm:mb-4">
                <div className="pb-2 border-b border-emerald-500/30">
                  <h3 className="text-base sm:text-lg font-bold text-emerald-700">
                    ✓ INCLUDED FREE
                  </h3>
                  <p className="text-xs text-emerald-600 mt-1">
                    Essential features competitors charge $19+/month for
                  </p>
                </div>
              </div>
            ) : category === "Advanced Features" ? (
              <div className="mb-3 sm:mb-4 mt-6 sm:mt-8">
                <div className="pb-2 border-b border-slate-300">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">ADD MORE POWER</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Click to add features that take your site further
                  </p>
                </div>
              </div>
            ) : null}

            {/* Features Grid - responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 ${isAlwaysIncluded ? "mb-6" : ""}`}
            >
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
        );
      })}
    </div>
  );
}
