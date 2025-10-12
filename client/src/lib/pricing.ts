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
    maxPages: 1,
    tierName: "Simple Landing Page (1 page)",
    basePrice: 750,
    pricePerPage: 0,
    description: "Perfect for a single landing page or coming soon page"
  },
  {
    minPages: 2,
    maxPages: 4,
    tierName: "Simple Landing Page (1-4 pages)",
    basePrice: 750,
    pricePerPage: 250,
    description: "Great for small businesses with a few key pages"
  },
  {
    minPages: 5,
    maxPages: 8,
    tierName: "Multi-Page Site (5-8 pages)",
    basePrice: 1500,
    pricePerPage: 200,
    description: "Ideal for growing businesses with more content"
  },
  {
    minPages: 9,
    maxPages: 15,
    tierName: "Complex Site (9-15 pages)",
    basePrice: 2300,
    pricePerPage: 150,
    description: "For established businesses with extensive content needs"
  },
  {
    minPages: 16,
    maxPages: 999,
    tierName: "Large Site",
    basePrice: 3350,
    pricePerPage: 100,
    description: "Enterprise-level websites with many pages"
  }
];

/**
 * Calculate the price for a given number of pages
 */
export function calculatePagePrice(pageCount: number): { price: number; tier: string } {
  let price = 0;
  let tier = "";

  if (pageCount === 1) {
    price = 750;
    tier = "Simple Landing Page (1 page)";
  } else if (pageCount <= 4) {
    price = 750 + ((pageCount - 1) * 250);
    tier = "Simple Landing Page (1-4 pages)";
  } else if (pageCount <= 8) {
    price = 1500 + ((pageCount - 4) * 200);
    tier = "Multi-Page Site (5-8 pages)";
  } else if (pageCount <= 15) {
    price = 2300 + ((pageCount - 8) * 150);
    tier = "Complex Site (9-15 pages)";
  } else {
    price = 3350 + ((pageCount - 15) * 100);
    tier = `Large Site (${pageCount} pages)`;
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
    isAlwaysIncluded: true
  },
  {
    id: "ssl-hosting",
    name: "SSL & Premium Hosting",
    description: "Secure HTTPS, 99.9% uptime, CDN, daily backups",
    price: 0,
    saasMonthly: 25,
    category: "Always Included",
    isAlwaysIncluded: true
  },
  {
    id: "responsive",
    name: "Mobile Responsive Design",
    description: "Perfect on phones, tablets, and desktops",
    price: 0,
    saasMonthly: 0,
    category: "Always Included",
    isAlwaysIncluded: true
  },
  {
    id: "basic-seo",
    name: "Basic SEO Setup",
    description: "Meta tags, sitemap, search console integration",
    price: 0,
    saasMonthly: 79,
    category: "Always Included",
    isAlwaysIncluded: true
  },
  {
    id: "contact-forms",
    name: "Contact Forms",
    description: "Basic contact forms with email notifications",
    price: 0,
    saasMonthly: 15,
    category: "Always Included",
    isAlwaysIncluded: true
  }
];

/**
 * Optional add-on features
 */
export const OPTIONAL_FEATURES: Feature[] = [
  // Marketing & Growth
  {
    id: "seo",
    name: "SEO Optimization",
    description: "Foundation for Google rankings",
    price: 400,
    saasMonthly: 99,
    category: "Marketing & Growth"
  },
  {
    id: "forms",
    name: "Custom Lead Forms",
    description: "Advanced multi-step forms",
    price: 500,
    saasMonthly: 50,
    category: "Marketing & Growth"
  },
  // Content Management
  {
    id: "cms",
    name: "Content Management",
    description: "Easy content updates (5 users)",
    price: 800,
    saasMonthly: 149,
    category: "Content Management"
  },
  {
    id: "blog",
    name: "Blog System",
    description: "Built-in blogging platform",
    price: 600,
    saasMonthly: 29,
    category: "Content Management"
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Multiple language support",
    price: 700,
    saasMonthly: 79,
    category: "Content Management"
  },
  // User Features
  {
    id: "auth",
    name: "User Authentication",
    description: "Login, signup, password reset (up to 1000 users)",
    price: 1500,
    saasMonthly: 99,
    category: "User Features"
  },
  {
    id: "database",
    name: "Database Integration",
    description: "Secure data storage",
    price: 1200,
    saasMonthly: 79,
    category: "User Features"
  },
  // E-commerce & Payments
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Shopping cart and checkout",
    price: 2500,
    saasMonthly: 299,
    category: "E-commerce & Payments"
  },
  {
    id: "payment",
    name: "Payment Processing",
    description: "Accept credit cards",
    price: 1000,
    saasMonthly: 89,
    category: "E-commerce & Payments"
  },
  // Booking & Scheduling
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment scheduling (3 users)",
    price: 800,
    saasMonthly: 49,
    category: "Booking & Scheduling"
  },
  // Integrations & Support
  {
    id: "api",
    name: "API Integration",
    description: "Connect third-party tools",
    price: 600,
    saasMonthly: 59,
    category: "Integrations & Support"
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Real-time customer support (5 users)",
    price: 300,
    saasMonthly: 69,
    category: "Integrations & Support"
  },
  // Design & UX
  {
    id: "animations",
    name: "Advanced Animations",
    description: "Premium interactions",
    price: 400,
    saasMonthly: 0,
    category: "Design & UX"
  }
];

/**
 * All features combined
 */
export const ALL_FEATURES: Feature[] = [
  ...ALWAYS_INCLUDED_FEATURES,
  ...OPTIONAL_FEATURES
];

/**
 * SaaS competitor pricing
 */
export const SAAS_PRICING = {
  platformCostPerUser: 23, // Base platform cost per user per month
  pageCostPerPage: 15, // Cost per page per month

  // Features that scale with number of users
  userScalingFeatures: ['cms', 'auth', 'booking', 'chat'],

  // Base users included before per-user charges kick in
  baseUsersIncluded: 3,

  // Per-user multiplier for scaling features (50% of base cost per additional user)
  perUserMultiplier: 0.5
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
    .filter(f => f.saasMonthly > 0)
    .reduce((sum, f) => {
      const isScaling = SAAS_PRICING.userScalingFeatures.includes(f.id);
      if (isScaling) {
        const additionalUsers = Math.max(0, users - SAAS_PRICING.baseUsersIncluded);
        return sum + f.saasMonthly + (additionalUsers * (f.saasMonthly * SAAS_PRICING.perUserMultiplier));
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
    threeYearTotal
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
