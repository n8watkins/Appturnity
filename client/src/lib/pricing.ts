/**
 * Pricing Configuration
 * Central source of truth for all pricing across the application
 */

export interface PricingTier {
  minPages: number;
  maxPages: number;
  tierName: string;
  basePrice: number;
  pricePerPage: number;
  description: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  saasMonthly: number;
  category: string;
  isAlwaysIncluded?: boolean;
}

/**
 * Page-based pricing tiers with volume discounts
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    minPages: 1,
    maxPages: 5,
    tierName: "Essential (1-5 pages)",
    basePrice: 750,
    pricePerPage: 0,
    description: "Perfect for landing pages & small sites",
  },
  {
    minPages: 6,
    maxPages: 12,
    tierName: "Professional (6-12 pages)",
    basePrice: 1700,
    pricePerPage: 0,
    description: "Most popular for growing businesses",
  },
  {
    minPages: 13,
    maxPages: 20,
    tierName: "Growth (13-20 pages)",
    basePrice: 2450,
    pricePerPage: 0,
    description: "For established businesses",
  },
  {
    minPages: 21,
    maxPages: 999,
    tierName: "Premium",
    basePrice: 3500,
    pricePerPage: 100,
    description: "Large-scale custom solutions",
  },
];

/**
 * Calculate the price for a given number of pages
 */
export function calculatePagePrice(pageCount: number): { price: number; tier: string } {
  let price = 0;
  let tier = "";

  if (pageCount <= 5) {
    price = 750;
    tier = "Essential (1-5 pages)";
  } else if (pageCount <= 12) {
    price = 1700;
    tier = "Professional (6-12 pages)";
  } else if (pageCount <= 20) {
    price = 2450;
    tier = "Growth (13-20 pages)";
  } else {
    price = 3500 + (pageCount - 20) * 100;
    tier = `Premium (${pageCount} pages)`;
  }

  return { price, tier };
}

/**
 * Always included features (free with every project)
 */
export const ALWAYS_INCLUDED_FEATURES: Feature[] = [
  {
    id: "analytics",
    name: "Analytics & Tracking",
    description: "Google Analytics, conversion tracking, visitor insights",
    price: 0,
    saasMonthly: 49,
    category: "Always Included",
    isAlwaysIncluded: true,
  },
  {
    id: "ssl-hosting",
    name: "SSL & Premium Hosting",
    description: "Secure HTTPS, 99.9% uptime, CDN, daily backups",
    price: 0,
    saasMonthly: 25,
    category: "Always Included",
    isAlwaysIncluded: true,
  },
  {
    id: "responsive",
    name: "Mobile Responsive Design",
    description: "Perfect on phones, tablets, and desktops",
    price: 0,
    saasMonthly: 0,
    category: "Always Included",
    isAlwaysIncluded: true,
  },
  {
    id: "basic-seo",
    name: "Basic SEO Setup",
    description: "Meta tags, sitemap, search console integration",
    price: 0,
    saasMonthly: 79,
    category: "Always Included",
    isAlwaysIncluded: true,
  },
  {
    id: "contact-forms",
    name: "Contact Forms",
    description: "Basic contact forms with email notifications",
    price: 0,
    saasMonthly: 15,
    category: "Always Included",
    isAlwaysIncluded: true,
  },
];

/**
 * Optional add-on features
 */
export const OPTIONAL_FEATURES: Feature[] = [
  {
    id: "seo",
    name: "SEO",
    description: "Search engine optimization",
    price: 400,
    saasMonthly: 99,
    category: "Advanced Features",
  },
  {
    id: "forms",
    name: "Custom Forms",
    description: "Multi-step lead forms",
    price: 500,
    saasMonthly: 50,
    category: "Advanced Features",
  },
  {
    id: "cms",
    name: "CMS",
    description: "Content management system",
    price: 800,
    saasMonthly: 149,
    category: "Advanced Features",
  },
  {
    id: "blog",
    name: "Blog",
    description: "Built-in blogging platform",
    price: 600,
    saasMonthly: 29,
    category: "Advanced Features",
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Multiple language support",
    price: 700,
    saasMonthly: 79,
    category: "Advanced Features",
  },
  {
    id: "auth",
    name: "User Authentication",
    description: "Login and signup system",
    price: 1500,
    saasMonthly: 99,
    category: "Advanced Features",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Shopping cart and checkout",
    price: 2500,
    saasMonthly: 299,
    category: "Advanced Features",
  },
  {
    id: "payment",
    name: "Payments",
    description: "Credit card processing",
    price: 1000,
    saasMonthly: 89,
    category: "Advanced Features",
  },
  {
    id: "booking",
    name: "Booking",
    description: "Appointment scheduling",
    price: 800,
    saasMonthly: 49,
    category: "Advanced Features",
  },
  {
    id: "api",
    name: "API Integration",
    description: "Connect third-party tools",
    price: 600,
    saasMonthly: 59,
    category: "Advanced Features",
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Real-time customer support",
    price: 300,
    saasMonthly: 69,
    category: "Advanced Features",
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer relationship management",
    price: 900,
    saasMonthly: 120,
    category: "Advanced Features",
  },
  {
    id: "cdn",
    name: "CDN",
    description: "Content delivery network",
    price: 300,
    saasMonthly: 45,
    category: "Advanced Features",
  },
  {
    id: "ai",
    name: "Generative AI",
    description: "AI-powered features",
    price: 1200,
    saasMonthly: 150,
    category: "Advanced Features",
  },
  {
    id: "animations",
    name: "Animations",
    description: "Premium interactions",
    price: 400,
    saasMonthly: 0,
    category: "Advanced Features",
  },
];

/**
 * All features combined
 */
export const ALL_FEATURES: Feature[] = [...ALWAYS_INCLUDED_FEATURES, ...OPTIONAL_FEATURES];

/**
 * SaaS competitor pricing
 */
export const SAAS_PRICING = {
  platformCostPerUser: 23, // Base platform cost per user per month
  pageCostPerPage: 15, // Cost per page per month

  // Features that scale with number of users
  userScalingFeatures: ["cms", "auth", "booking", "chat"],

  // Base users included before per-user charges kick in
  baseUsersIncluded: 3,

  // Per-user multiplier for scaling features (50% of base cost per additional user)
  perUserMultiplier: 0.5,
};

/**
 * Calculate SaaS costs for comparison
 */
export function calculateSaasPrice(
  pages: number,
  users: number,
  enabledFeatures: Feature[]
): {
  pageCost: number;
  platformCost: number;
  featureCost: number;
  monthlyTotal: number;
  threeYearTotal: number;
} {
  const pageCost = pages * SAAS_PRICING.pageCostPerPage;
  const platformCost = users * SAAS_PRICING.platformCostPerUser;

  const featureCost = enabledFeatures
    .filter((f) => f.saasMonthly > 0)
    .reduce((sum, f) => {
      const isScaling = SAAS_PRICING.userScalingFeatures.includes(f.id);
      if (isScaling) {
        const additionalUsers = Math.max(0, users - SAAS_PRICING.baseUsersIncluded);
        return (
          sum + f.saasMonthly + additionalUsers * (f.saasMonthly * SAAS_PRICING.perUserMultiplier)
        );
      }
      return sum + f.saasMonthly;
    }, 0);

  const monthlyTotal = pageCost + platformCost + featureCost;
  const threeYearTotal = monthlyTotal * 36;

  return {
    pageCost,
    platformCost,
    featureCost,
    monthlyTotal,
    threeYearTotal,
  };
}

/**
 * Calculate total competitors charge for always included features
 */
export function calculateAlwaysIncludedValue(): number {
  return ALWAYS_INCLUDED_FEATURES.reduce((sum, f) => sum + f.saasMonthly, 0);
}

/**
 * Calculate project timeline based on complexity
 */
export function calculateTimeline(pages: number, featuresTotal: number): string {
  const baseWeeks = Math.ceil(pages / 3);
  const featureWeeks = Math.ceil(featuresTotal / 1000);
  const totalWeeks = baseWeeks + featureWeeks;

  if (totalWeeks <= 2) return "1-2 weeks";
  if (totalWeeks <= 4) return "3-4 weeks";
  if (totalWeeks <= 8) return "1-2 months";
  return "2-3 months";
}
