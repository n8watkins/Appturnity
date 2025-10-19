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
 * Calculate base price and tier information based on page count and features
 */
export function calculateTierInfo(pageCount: number, features: FeatureWithEnabled[]): TierInfo {
  const advancedCount = features.filter((f) => f.enabled && !f.isAlwaysIncluded).length;

  // Determine base price and tier based on page count
  let price: number;
  let tier: string;
  let includedFeatures: number;

  if (pageCount <= 5) {
    price = 750; // Base price for Essential tier
    tier = "Essential";
    includedFeatures = 1; // +1 advanced feature
  } else if (pageCount <= 12) {
    price = 1700; // Base price for Professional tier
    tier = "Professional";
    includedFeatures = 3; // +3 advanced features
  } else if (pageCount <= 20) {
    price = 3200; // Base price for Enterprise tier
    tier = "Enterprise";
    includedFeatures = 7; // +7 advanced features
  } else {
    price = 5500; // Premium tier
    tier = "Premium";
    includedFeatures = 15; // +15 advanced features
  }

  // Determine actual tier based on advanced features
  let actualTier = tier;
  if (advancedCount > 7) {
    actualTier = "Enterprise";
  } else if (advancedCount > 3) {
    actualTier = "Professional";
  } else if (advancedCount > 1) {
    actualTier = "Essential";
  }

  return {
    basePrice: price,
    pageTier: tier,
    includedAdvancedFeatures: includedFeatures,
    actualTier,
    originalBasePrice: price,
  };
}

/**
 * Calculate total price including additional features
 */
export function calculateTotalPrice(tierInfo: TierInfo, features: FeatureWithEnabled[]): number {
  const { basePrice, includedAdvancedFeatures } = tierInfo;

  // Calculate feature costs for features beyond included count
  const advancedFeatures = features.filter((f) => f.enabled && f.price > 0);
  const sortedByPrice = [...advancedFeatures].sort((a, b) => a.price - b.price);

  let featureCost = 0;
  sortedByPrice.forEach((feature, index) => {
    if (index >= includedAdvancedFeatures) {
      featureCost += feature.price;
    }
  });

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
  const yearOneSavings = monthlySaasPrice * 12 - oneTimePrice;
  const threeYearSavings = monthlySaasPrice * 36 - oneTimePrice;
  const fiveYearSavings = monthlySaasPrice * 60 - oneTimePrice;

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
    case "Enterprise":
      return "bg-green-100 text-green-800 border-green-300";
    case "Premium":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}
