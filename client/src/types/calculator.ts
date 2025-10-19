/**
 * Pricing Calculator Type Definitions
 */

export type FeatureCategory = "essential" | "email" | "content" | "advanced" | "enterprise";

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FeatureCategory;
  dependencies?: string[];
  icon?: string;
  popular?: boolean;
}

export interface PricingTier {
  name: "Starter" | "Professional" | "Enterprise";
  min: number;
  max: number;
  color: string;
  features: string[];
}

export interface CalculatorData {
  pages: number;
  users?: number;
  selectedFeatures: string[];
  totalPrice: number;
  basePrice: number;
  featurePrice: number;
  tier: string;
  timeline: string;
}

export interface PriceBreakdown {
  basePrice: number;
  featurePrice: number;
  totalPrice: number;
  tier: string;
  timeline: string;
}
