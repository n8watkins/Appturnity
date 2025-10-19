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
              /* Mobile: 2-column grid layout */
              <>
                <div className="lg:hidden mb-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-emerald-800 uppercase">
                        Included Always
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      {categoryFeatures.map((feature) => (
                        <div key={feature.id} className="text-xs text-emerald-700">
                          • {feature.shortName || feature.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop: Original grid layout */}
                <div className="hidden lg:block">
                  <div className="mb-4">
                    <div className="pb-2 border-b border-emerald-500/30">
                      <h3 className="text-lg font-bold text-emerald-700">✓ INCLUDED FREE</h3>
                      <p className="text-xs text-emerald-600 mt-1">
                        Essential features competitors charge $19+/month for
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-6">
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
