/**
 * Pricing Calculator Utilities
 *
 * Shared utilities for pricing calculations, tier determination, and timeline estimation
 */

import type { Feature } from "@/lib/pricing";

export interface FeatureWithEnabled extends Feature {
  enabled: boolean;
}

export interface TierInfo {
  basePrice: number;
  pageTier: string;
  includedAdvancedFeatures: number;
  actualTier: string;
  originalBasePrice: number;
}

/**
 * Calculate optimal tier - finds the cheapest tier that supports the page count and features
 */
export function calculateOptimalTier(
  pageCount: number,
  advancedFeaturesCount: number
): { name: string; base: number; included: number } {
  const allTierOptions = [
    { name: "Essential", base: 750, included: 1, maxPages: 5 },
    { name: "Professional", base: 1700, included: 3, maxPages: 12 },
    { name: "Growth", base: 2450, included: 7, maxPages: 20 },
    {
      name: "Premium",
      base: 3500 + (pageCount > 20 ? (pageCount - 20) * 100 : 0),
      included: 15,
      maxPages: 999,
    },
  ];

  // Filter tiers that support the page count
  const compatibleTiers = allTierOptions.filter((tier) => pageCount <= tier.maxPages);

  // Find the cheapest compatible tier
  let bestTier = compatibleTiers[0];
  let bestCost = bestTier.base + Math.max(0, advancedFeaturesCount - bestTier.included) * 500;

  compatibleTiers.forEach((tier) => {
    const tierCost = tier.base + Math.max(0, advancedFeaturesCount - tier.included) * 500;
    if (tierCost < bestCost) {
      bestCost = tierCost;
      bestTier = tier;
    }
  });

  return bestTier;
}

/**
 * Calculate base price and tier information based on page count and features
 * Uses optimal tier calculation to find the cheapest option
 */
export function calculateTierInfo(pageCount: number, features: FeatureWithEnabled[]): TierInfo {
  const advancedCount = features.filter((f) => f.enabled && !f.isAlwaysIncluded).length;

  // Calculate optimal tier (cheapest option that supports page count and features)
  const optimalTier = calculateOptimalTier(pageCount, advancedCount);

  return {
    basePrice: optimalTier.base,
    pageTier: optimalTier.name,
    includedAdvancedFeatures: optimalTier.included,
    actualTier: optimalTier.name,
    originalBasePrice: optimalTier.base,
  };
}

/**
 * Calculate total price including additional features
 * Each feature beyond the included count costs $500
 */
export function calculateTotalPrice(tierInfo: TierInfo, features: FeatureWithEnabled[]): number {
  const { basePrice, includedAdvancedFeatures } = tierInfo;

  // Count advanced features (features with price > 0)
  const advancedFeaturesCount = features.filter((f) => f.enabled && f.price > 0).length;

  // Calculate feature costs: $500 per feature beyond included count
  const extraFeaturesCount = Math.max(0, advancedFeaturesCount - includedAdvancedFeatures);
  const featureCost = extraFeaturesCount * 500;

  return basePrice + featureCost;
}

/**
 * Calculate monthly SaaS equivalent cost
 */
export function calculateSaasPrice(features: FeatureWithEnabled[]): number {
  const enabledFeatures = features.filter((f) => f.enabled);
  return enabledFeatures.reduce((sum, f) => sum + (f.saasMonthly || 0), 0);
}

/**
 * Calculate timeline based on pages and features
 */
export function calculateTimeline(pageCount: number, featureCount: number): string {
  const totalComplexity = pageCount + featureCount * 2;

  if (totalComplexity <= 10) return "2-3 weeks";
  if (totalComplexity <= 20) return "3-4 weeks";
  if (totalComplexity <= 30) return "4-6 weeks";
  if (totalComplexity <= 50) return "6-8 weeks";
  return "8-12 weeks";
}

/**
 * Calculate ROI information
 */
export interface ROIInfo {
  monthlyEquivalent: number;
  breakEvenMonths: number;
  yearOneSavings: number;
  threeYearSavings: number;
  fiveYearSavings: number;
}

export function calculateROI(oneTimePrice: number, monthlySaasPrice: number): ROIInfo {
  const breakEvenMonths = Math.ceil(oneTimePrice / monthlySaasPrice);
  const yearOneSavings = Math.max(0, monthlySaasPrice * 12 - oneTimePrice);
  const threeYearSavings = Math.max(0, monthlySaasPrice * 36 - oneTimePrice);
  const fiveYearSavings = Math.max(0, monthlySaasPrice * 60 - oneTimePrice);

  return {
    monthlyEquivalent: monthlySaasPrice,
    breakEvenMonths,
    yearOneSavings,
    threeYearSavings,
    fiveYearSavings,
  };
}

/**
 * Get tier badge color
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case "Essential":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Professional":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Growth":
      return "bg-green-100 text-green-800 border-green-300";
    case "Premium":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}
