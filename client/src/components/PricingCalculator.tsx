import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { handleSmoothScroll } from "@/lib/utils";
import { getQuizResults } from "@/lib/quizStorage";

interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  saasMonthly: number;
  enabled: boolean;
  category: string;
  alwaysIncluded?: boolean;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

const FEATURES: Feature[] = [
  // Always Included (Free)
  {
    id: "analytics",
    name: "Analytics & Tracking",
    description: "Google Analytics & tracking",
    price: 0,
    saasMonthly: 19,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "ssl-hosting",
    name: "SSL & Premium Hosting",
    description: "HTTPS, 99.9% uptime, CDN",
    price: 0,
    saasMonthly: 0,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "responsive",
    name: "Mobile Responsive Design",
    description: "Works on all devices",
    price: 0,
    saasMonthly: 0,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "basic-seo",
    name: "Basic SEO Setup",
    description: "Meta tags & sitemaps",
    price: 0,
    saasMonthly: 0,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "contact-forms",
    name: "Contact Forms",
    description: "Forms with notifications",
    price: 0,
    saasMonthly: 0,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "domain-setup",
    name: "Custom Domain Setup",
    description: "Connect your domain",
    price: 0,
    saasMonthly: 0,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  // Marketing & Growth
  {
    id: "seo",
    name: "SEO",
    description: "Search optimization",
    price: 500,
    saasMonthly: 49,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "email-templates",
    name: "Email Templates",
    description: "Custom branded emails",
    price: 500,
    saasMonthly: 15,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "email-automation",
    name: "Email Automation",
    description: "Automated sequences",
    price: 500,
    saasMonthly: 39,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "newsletter",
    name: "Newsletter Management",
    description: "Email list building",
    price: 500,
    saasMonthly: 29,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "forms",
    name: "Custom Forms",
    description: "Multi-step forms",
    price: 500,
    saasMonthly: 25,
    enabled: false,
    category: "Advanced Features"
  },
  // Content Management
  {
    id: "cms",
    name: "CMS",
    description: "Content management",
    price: 500,
    saasMonthly: 79,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "blog",
    name: "Blog",
    description: "Blogging platform",
    price: 500,
    saasMonthly: 15,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Language support",
    price: 500,
    saasMonthly: 39,
    enabled: false,
    category: "Advanced Features"
  },
  // User Features
  {
    id: "auth",
    name: "User Authentication",
    description: "Login & signup",
    price: 500,
    saasMonthly: 49,
    enabled: false,
    category: "Advanced Features"
  },
  // E-commerce & Payments
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Cart & checkout",
    price: 500,
    saasMonthly: 149,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "payment",
    name: "Payments",
    description: "Card processing",
    price: 500,
    saasMonthly: 39,
    enabled: false,
    category: "Advanced Features"
  },
  // Booking & Scheduling
  {
    id: "booking",
    name: "Booking",
    description: "Scheduling system",
    price: 500,
    saasMonthly: 29,
    enabled: false,
    category: "Advanced Features"
  },
  // Integrations & Support
  {
    id: "api",
    name: "API Integration",
    description: "Third-party tools",
    price: 500,
    saasMonthly: 29,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Customer support",
    price: 500,
    saasMonthly: 39,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer management",
    price: 500,
    saasMonthly: 59,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "cdn",
    name: "CDN",
    description: "Content delivery",
    price: 500,
    saasMonthly: 20,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "ai",
    name: "Generative AI",
    description: "AI features",
    price: 500,
    saasMonthly: 79,
    enabled: false,
    category: "Advanced Features"
  },
  // Design & UX
  {
    id: "animations",
    name: "Animations",
    description: "Premium effects",
    price: 500,
    saasMonthly: 0,
    enabled: false,
    category: "Advanced Features"
  }
];

// Quiz discount percentage
const QUIZ_DISCOUNT_PERCENT = 10;

export default function PricingCalculator() {
  const [pages, setPages] = useState(5);
  const [users, setUsers] = useState(3);
  const [features, setFeatures] = useState<Feature[]>(FEATURES);
  const [prefilledFromQuiz, setPrefilledFromQuiz] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Memoize calculations to prevent unnecessary re-renders
  const { basePrice, pageTier, includedAdvancedFeatures, actualTier, originalBasePrice } = useMemo(() => {
    const advancedCount = features.filter(f => f.enabled && !f.alwaysIncluded).length;

    const getBasePriceAndTier = (pageCount: number) => {
      // Pricing aligned with pricing tiers structure
      let price;
      let tier;
      let includedFeatures;

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

      return { price, tier, includedFeatures };
    };

    // Calculate what price would be with different tiers
    const calculateTierPrice = (tierBase: number, tierIncluded: number) => {
      const paidFeatures = Math.max(0, advancedCount - tierIncluded);
      return tierBase + (paidFeatures * 500);
    };

    const currentTier = getBasePriceAndTier(pages);
    let bestPrice = calculateTierPrice(currentTier.price, currentTier.includedFeatures);
    let bestTier = currentTier.tier;
    let bestIncluded = currentTier.includedFeatures;

    // Always check all tiers to find the cheapest option based on add-on count
    const allTierOptions = [
      { name: "Essential", base: 750, included: 1 },
      { name: "Professional", base: 1700, included: 3 },
      { name: "Enterprise", base: 3200, included: 7 },
      { name: "Premium", base: 5500, included: 15 }
    ];

    // Find the tier with the lowest total price
    allTierOptions.forEach(tier => {
      const tierPrice = calculateTierPrice(tier.base, tier.included);
      if (tierPrice < bestPrice) {
        bestPrice = tierPrice;
        bestTier = tier.name;
        bestIncluded = tier.included;
      }
    });

    return {
      basePrice: bestPrice,
      pageTier: bestTier,
      includedAdvancedFeatures: bestIncluded,
      actualTier: bestTier,
      originalBasePrice: currentTier.price
    };
  }, [pages, features]);

  const featuresTotal = useMemo(() =>
    features
      .filter(f => f.enabled)
      .reduce((sum, f) => sum + f.price, 0),
    [features]
  );

  // Calculate enabled advanced features count and apply tier discount
  const { adjustedFeaturesTotal, enabledAdvancedCount } = useMemo(() => {
    const advancedFeatures = features.filter(f => f.enabled && !f.alwaysIncluded);
    const count = advancedFeatures.length;

    // Apply tier-based included features discount
    let adjustedTotal = featuresTotal;
    if (count > 0 && includedAdvancedFeatures > 0 && includedAdvancedFeatures !== Infinity) {
      // Get cheapest features up to included count
      const sortedFeatures = [...advancedFeatures].sort((a, b) => a.price - b.price);
      const discountedFeatures = sortedFeatures.slice(0, Math.min(count, includedAdvancedFeatures));
      const discount = discountedFeatures.reduce((sum, f) => sum + f.price, 0);
      adjustedTotal = Math.max(0, featuresTotal - discount);
    } else if (includedAdvancedFeatures === Infinity) {
      // Premium tier - all advanced features free
      adjustedTotal = 0;
    }

    return { adjustedFeaturesTotal: adjustedTotal, enabledAdvancedCount: count };
  }, [features, featuresTotal, includedAdvancedFeatures]);

  const totalPrice = useMemo(() => {
    // Apply quiz discount if quiz was completed
    if (prefilledFromQuiz) {
      return Math.round(basePrice * (1 - QUIZ_DISCOUNT_PERCENT / 100));
    }
    return basePrice;
  }, [basePrice, prefilledFromQuiz]);

  const quizDiscount = useMemo(() => {
    if (prefilledFromQuiz) {
      return basePrice - totalPrice;
    }
    return 0;
  }, [basePrice, totalPrice, prefilledFromQuiz]);

  // Calculate SaaS costs with per-user scaling (memoized) - conservative estimates
  const saasPageCost = useMemo(() => pages * 5, [pages]); // $5/page/month for SaaS platforms (conservative)
  const saasBasePlatformCost = useMemo(() => 8 * users, [users]); // $8/user/month minimum (conservative)

  const saasFeatureCosts = useMemo(() =>
    features
      .filter(f => f.enabled && f.saasMonthly > 0)
      .reduce((sum, f) => {
        // Features that scale per-user (CMS, Auth, Booking, Chat)
        const scalingFeatures = ['cms', 'auth', 'booking', 'chat'];
        if (scalingFeatures.includes(f.id)) {
          // These cost per-user (after first 3 users included)
          const additionalUsers = Math.max(0, users - 3);
          return sum + f.saasMonthly + (additionalUsers * (f.saasMonthly * 0.5)); // 50% of base per extra user
        }
        return sum + f.saasMonthly;
      }, 0),
    [features, users]
  );

  const saasMonthlyTotal = useMemo(
    () => saasBasePlatformCost + saasPageCost + saasFeatureCosts,
    [saasBasePlatformCost, saasPageCost, saasFeatureCosts]
  );

  const saasThreeYearTotal = useMemo(() => saasMonthlyTotal * 36, [saasMonthlyTotal]);

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f =>
      // Don't toggle if it's always included
      f.id === id && !f.alwaysIncluded ? { ...f, enabled: !f.enabled } : f
    ));
  };

  // Group features by category (memoized)
  const featuresByCategory = useMemo(() =>
    features.reduce((acc, feature) => {
      const category = feature.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feature);
      return acc;
    }, {} as Record<string, Feature[]>),
    [features]
  );

  const calculateTimeline = () => {
    const baseWeeks = Math.ceil(pages / 3);
    const featureWeeks = Math.ceil(featuresTotal / 1000);
    const totalWeeks = baseWeeks + featureWeeks;

    if (totalWeeks <= 2) return "1-2 weeks";
    if (totalWeeks <= 4) return "3-4 weeks";
    if (totalWeeks <= 8) return "1-2 months";
    return "2-3 months";
  };

  // Helper function to prefill calculator from quiz data
  const prefillFromQuiz = (data: any) => {
    // Prefill pages from pageCount question
    if (data.pageCount) {
      const pageRange = data.pageCount;
      let pageValue = 5; // default

      if (pageRange === '1-5') pageValue = 3;
      else if (pageRange === '6-12') pageValue = 9;
      else if (pageRange === '13-20') pageValue = 16;
      else if (pageRange === '20+') pageValue = 25; // Premium tier (> 20 pages)
      else if (pageRange === 'not-sure') pageValue = 8; // default to Professional tier

      setPages(pageValue);
      setPrefilledFromQuiz(true);
    }

    // Prefill users from teamSize question
    if (data.teamSize) {
      const teamRange = data.teamSize;
      let userValue = 3; // default

      if (teamRange === '1-3') userValue = 2;
      else if (teamRange === '4-7') userValue = 5;
      else if (teamRange === '8-15') userValue = 10;
      else if (teamRange === '15+') userValue = 15;

      setUsers(userValue);
      setPrefilledFromQuiz(true);
    }

    // Pre-enable features based on quiz
    if (data.desiredFeatures && Array.isArray(data.desiredFeatures)) {
      setFeatures(prev => prev.map(feature => ({
        ...feature,
        enabled: data.desiredFeatures.includes(feature.id) || feature.alwaysIncluded
      })));
      setPrefilledFromQuiz(true);
    }
  };

  // Check for quiz prefill on mount
  useEffect(() => {
    const quizData = getQuizResults();
    if (quizData) {
      prefillFromQuiz(quizData);
    }
  }, []);

  // Listen for quiz completion events in real-time
  useEffect(() => {
    const handleQuizCompleted = (event: CustomEvent) => {
      prefillFromQuiz(event.detail);
    };

    window.addEventListener('quizCompleted', handleQuizCompleted as EventListener);

    return () => {
      window.removeEventListener('quizCompleted', handleQuizCompleted as EventListener);
    };
  }, []);

  // Dispatch calculator updates whenever values change
  useEffect(() => {
    // Only dispatch if we have valid data (skip initial render)
    if (pages && features.length > 0) {
      const calculatorData = {
        pages,
        users,
        selectedFeatures: features.filter(f => f.enabled).map(f => f.id),
        basePrice,
        totalPrice,
        timeline: calculateTimeline(),
        timestamp: new Date().toISOString()
      };

      window.dispatchEvent(new CustomEvent('calculatorUpdated', {
        detail: calculatorData
      }));
    }
  }, [pages, users, features, basePrice, totalPrice]);

  const handleShowComparison = () => {
    setIsCalculating(true);
    // Simulate loading for dramatic effect
    setTimeout(() => {
      setIsCalculating(false);
      setShowComparison(true);
      // Scroll to comparison
      setTimeout(() => {
        document.getElementById('savings-comparison')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }, 2000); // 2 second loading animation
  };

  const handleRedesign = () => {
    setShowComparison(false);
    // Scroll back to calculator
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetQuote = () => {
    const calculatorData = {
      pages,
      users,
      selectedFeatures: features.filter(f => f.enabled).map(f => f.id),
      basePrice,
      featuresTotal,
      totalPrice,
      saasMonthlyTotal: Math.round(saasMonthlyTotal),
      saasThreeYearTotal: Math.round(saasThreeYearTotal),
      savings: Math.round(saasThreeYearTotal - totalPrice),
      timeline: calculateTimeline(),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('calculatorResults', JSON.stringify(calculatorData));

    window.dispatchEvent(new CustomEvent('calculatorCompleted', {
      detail: calculatorData
    }));

    handleSmoothScroll(new Event('click') as any, 'contact', undefined, true);
  };

  return (
    <section id="pricing" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 scroll-mt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Build Your Perfect Solution
          </h2>
          <p className="text-lg text-slate-300">
            Configure your project, select features, and see your investment instantly. Pay once, own forever.
          </p>

          {prefilledFromQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              <Check className="h-4 w-4" />
              Based on your quiz results
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="shadow-lg border border-slate-300 bg-white">
            <CardContent className="p-6 md:p-8">
              {/* Loading Animation */}
              <AnimatePresence mode="wait">
                {isCalculating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="relative w-16 h-16">
                        <motion.div
                          className="absolute inset-0 border-4 border-primary/30 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Calculating Your Savings...
                    </h3>
                    <p className="text-sm text-slate-600">
                      Comparing your investment to monthly subscription costs
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comparison Report - Replaces Calculator Content */}
              <AnimatePresence mode="wait">
                {showComparison && !isCalculating && (
                  <motion.div
                    key="comparison"
                    id="savings-comparison"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-center text-sm text-slate-600 mb-6">
                      Here's your customized quote vs monthly subscriptions
                    </p>

                    {/* Compact Side by Side Comparison */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {/* Our Solution */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300 flex flex-col"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Check className="h-5 w-5 text-green-600" />
                          <h4 className="text-lg font-bold text-green-900">Appturnity Solution</h4>
                        </div>

                        {/* Itemized Costs */}
                        <div className="space-y-2 mb-4 text-sm flex-grow">
                          <div className="flex justify-between">
                            <span className="text-green-800">{pageTier} Plan ({pages} {pages === 1 ? 'page' : 'pages'}):</span>
                            <span className="font-semibold text-green-900">
                              ${(() => {
                                const tierBases = { Essential: 750, Professional: 1700, Enterprise: 3200, Premium: 5500 };
                                return tierBases[pageTier as keyof typeof tierBases].toLocaleString();
                              })()}
                            </span>
                          </div>

                          {/* Show advanced features broken down */}
                          {(() => {
                            const advancedFeatures = features.filter(f => f.enabled && f.price > 0);
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
                                {includedFeatures.length > 0 && includedFeatures.map((f) => (
                                  <div key={f.id} className="flex justify-between text-xs">
                                    <span className="text-green-700">• {f.name} (included)</span>
                                    <span className="text-green-600 line-through">${f.price}</span>
                                  </div>
                                ))}
                                {paidFeatures.length > 0 && paidFeatures.map((f) => (
                                  <div key={f.id} className="flex justify-between text-xs">
                                    <span className="text-green-700">• {f.name}</span>
                                    <span className="text-green-900 font-semibold">+${f.price}</span>
                                  </div>
                                ))}
                              </>
                            );
                          })()}

                          {/* Show quiz discount in comparison */}
                          {prefilledFromQuiz && quizDiscount > 0 && (
                            <div className="flex justify-between text-xs bg-yellow-100 p-1.5 rounded -mx-1">
                              <span className="text-yellow-900 font-semibold">🎉 Quiz Discount ({QUIZ_DISCOUNT_PERCENT}%):</span>
                              <span className="text-yellow-900 font-bold">-${quizDiscount}</span>
                            </div>
                          )}

                          <div className="border-t border-green-300 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span className="text-green-900">Total (one-time):</span>
                              <div className="text-right">
                                {prefilledFromQuiz && quizDiscount > 0 && (
                                  <div className="text-xs text-green-700 line-through mr-2 inline">
                                    ${basePrice.toLocaleString()}
                                  </div>
                                )}
                                <span className="text-green-900 text-lg">${totalPrice.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-green-800">Monthly cost:</span>
                              <span className="font-bold text-green-900">$0</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-green-300 pt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                            <Check className="h-3.5 w-3.5" /> You own the code
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                            <Check className="h-3.5 w-3.5" /> Unlimited users
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                            <Check className="h-3.5 w-3.5" /> No monthly fees
                          </span>
                        </div>
                      </motion.div>

                      {/* Monthly Subscription */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-300 flex flex-col"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <X className="h-5 w-5 text-red-600" />
                          <h4 className="text-lg font-bold text-red-900">Monthly SaaS Platforms</h4>
                        </div>

                        {/* Itemized Monthly Costs */}
                        <div className="space-y-2 mb-4 text-sm flex-grow">
                          <div className="flex justify-between">
                            <span className="text-red-800">{pages} {pages === 1 ? 'page' : 'pages'} × $8/page:</span>
                            <span className="font-semibold text-red-900">${saasPageCost}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-800">{users} {users === 1 ? 'user' : 'users'} × $12/user:</span>
                            <span className="font-semibold text-red-900">${saasBasePlatformCost}/mo</span>
                          </div>

                          {/* Feature Costs */}
                          {features.filter(f => f.enabled && f.saasMonthly > 0).map(f => {
                            const scalingFeatures = ['cms', 'auth', 'booking', 'chat'];
                            const isScaling = scalingFeatures.includes(f.id);
                            const additionalUsers = Math.max(0, users - 3);
                            const featureCost = isScaling
                              ? f.saasMonthly + (additionalUsers * (f.saasMonthly * 0.5))
                              : f.saasMonthly;

                            return (
                              <div key={f.id} className="flex justify-between text-xs">
                                <span className="text-red-700">• {f.name}</span>
                                <span className="text-red-900 font-medium">${Math.round(featureCost)}/mo</span>
                              </div>
                            );
                          })}

                          <div className="border-t border-red-300 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span className="text-red-900">Monthly total:</span>
                              <span className="text-red-900 text-lg">${Math.round(saasMonthlyTotal)}/mo</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-red-300 pt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                            <X className="h-3.5 w-3.5" /> Platform lock-in
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                            <X className="h-3.5 w-3.5" /> Per-user fees
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                            <X className="h-3.5 w-3.5" /> Price increases
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Savings Highlight - More Compact */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white text-center shadow-xl mb-6"
                    >
                      <p className="text-xs font-medium mb-1 uppercase tracking-wide opacity-90">Total Savings Compared to SaaS Platforms</p>
                      <p className="text-5xl font-bold mb-2">
                        ${(saasThreeYearTotal - totalPrice).toLocaleString()}
                      </p>
                      <div className="space-y-1 opacity-90">
                        <p className="text-sm">
                          Pay once: <strong>${totalPrice.toLocaleString()}</strong> vs SaaS total over 3 years: <strong>${Math.round(saasThreeYearTotal).toLocaleString()}</strong>
                        </p>
                        <p className="text-xs opacity-75">
                          Save an average of ${Math.round((saasThreeYearTotal - totalPrice) / 36).toLocaleString()}/month by owning your solution
                        </p>
                      </div>
                    </motion.div>

                    {/* Disclaimers */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs text-slate-600 space-y-2">
                      <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Important Notes:
                      </p>
                      <ul className="space-y-1 ml-5 list-disc">
                        <li>
                          <strong>SaaS pricing sources:</strong> Based on published pricing from Webflow ($29-212/mo), Wix ($27-159/mo), Squarespace ($25-65/mo), Shopify ($39-399/mo), and HubSpot CMS ($23-1,200/mo)
                        </li>
                        <li>
                          <strong>What's excluded:</strong> Comparison focuses on platform and feature costs only. Standard operational costs like SSL certificates, domain registration, and hosting are typically included in both solutions and not factored into the savings calculation.
                        </li>
                        <li>Your quote is fixed for 30 days from today</li>
                        <li>Includes {calculateTimeline()} delivery timeline</li>
                        <li>Hosting and SSL certificates included for first year ($200/year thereafter)</li>
                        <li>Optional maintenance plans available starting at $99/month</li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <Button
                        onClick={handleGetQuote}
                        size="lg"
                        className="flex-1 text-base py-5 font-semibold"
                      >
                        Get Your Free Quote →
                      </Button>
                      <Button
                        onClick={handleRedesign}
                        variant="outline"
                        size="lg"
                        className="flex-1 text-base py-5 font-semibold border-2"
                      >
                        ← Adjust My Solution
                      </Button>
                    </motion.div>

                    <p className="text-center text-xs text-slate-500 mt-3">
                      No commitment required • Response within 24 hours
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calculator Content - Show when not in comparison mode */}
              <AnimatePresence mode="wait">
                {!showComparison && !isCalculating && (
                  <motion.div
                    key="calculator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
              <div className="grid md:grid-cols-[1fr_450px] gap-8">
                {/* LEFT COLUMN - Sliders & Advanced Features */}
                <div>
                  {/* Project Configuration Sliders */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 mb-6">
                    {/* Number of Pages Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-base font-semibold text-slate-700">
                          Number of Pages
                        </label>
                        <span className="text-2xl font-bold text-slate-900">
                          {pages}
                        </span>
                      </div>
                      <Slider
                        value={[pages]}
                        onValueChange={(value) => setPages(value[0])}
                        min={1}
                        max={20}
                        step={1}
                        className="my-2"
                      />
                    </div>

                    {/* Number of Users Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-base font-semibold text-slate-700">
                          Number of Users
                        </label>
                        <span className="text-2xl font-bold text-slate-900">
                          {users}
                        </span>
                      </div>
                      <Slider
                        value={[users]}
                        onValueChange={(value) => setUsers(value[0])}
                        min={1}
                        max={20}
                        step={1}
                        className="my-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
                      const isAlwaysIncluded = category === "Always Included";

                      return (
                        <div key={category}>
                          {/* Section Header */}
                          {isAlwaysIncluded ? (
                            <div className="mb-4">
                              <div className="pb-2 border-b border-emerald-500/30">
                                <h3 className="text-lg font-bold text-emerald-700">
                                  ✓ INCLUDED FREE
                                </h3>
                                <p className="text-xs text-emerald-600 mt-1">Essential features competitors charge $19+/month for</p>
                              </div>
                            </div>
                          ) : category === "Advanced Features" ? (
                            <div className="mb-4 mt-8">
                              <div className="pb-2 border-b border-slate-300">
                                <h3 className="text-lg font-bold text-slate-900">
                                  ADD MORE POWER
                                </h3>
                                <p className="text-xs text-slate-600 mt-1">Click to add features that take your site further</p>
                              </div>
                            </div>
                          ) : null}

                          {/* Features Grid */}
                          <div className={`grid grid-cols-3 gap-2.5 ${isAlwaysIncluded ? 'mb-6' : ''}`}>
                            {categoryFeatures.map((feature) => (
                              <motion.div
                                key={feature.id}
                                whileHover={!feature.alwaysIncluded ? { scale: 1.02 } : {}}
                                whileTap={!feature.alwaysIncluded ? { scale: 0.98 } : {}}
                              >
                                <button
                                  onClick={() => toggleFeature(feature.id)}
                                  disabled={feature.alwaysIncluded}
                                  className={`w-full text-left p-3 rounded-lg border transition-all h-full ${
                                    feature.alwaysIncluded
                                      ? 'border-emerald-300 bg-emerald-50 cursor-default'
                                      : feature.enabled
                                      ? 'border-primary bg-primary/5'
                                      : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-start gap-2.5">
                                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                                        feature.alwaysIncluded
                                          ? 'bg-emerald-600 border-emerald-600'
                                          : feature.enabled
                                          ? 'bg-primary border-primary'
                                          : 'border-slate-400'
                                      }`}>
                                        {(feature.enabled || feature.alwaysIncluded) && <Check className="h-3.5 w-3.5 text-white" />}
                                      </div>

                                      <h4 className={`font-semibold text-base leading-tight flex-grow ${
                                        feature.alwaysIncluded ? 'text-emerald-800' : 'text-slate-900'
                                      }`}>
                                        {feature.name}
                                      </h4>
                                    </div>
                                    <p className={`text-sm leading-snug pl-7 ${
                                      feature.alwaysIncluded ? 'text-emerald-700' : 'text-slate-600'
                                    }`}>
                                      {feature.description}
                                    </p>
                                  </div>
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN - Calculator */}
                <div className="md:sticky md:top-4 md:self-start space-y-6">
                  {/* Our Recommendation */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-2xl font-bold text-green-900 flex items-center gap-2">
                        <Check className="h-6 w-6 text-green-600" />
                        Our Recommendation
                      </h4>
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {pageTier} Plan
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mb-4 font-medium">
                      Best value for your needs • Pay once, own forever
                    </p>

                    <div className="space-y-1.5 text-base text-green-900">
                      {/* Plan Tier with Details */}
                      <div className="bg-green-100/50 rounded-lg p-2.5 border border-green-200">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-base font-semibold text-green-900">
                            {pageTier} Plan
                          </span>
                          <motion.span
                            key={`our-pages-${basePrice}`}
                            initial={{ color: '#15803d' }}
                            animate={{ color: '#14532d' }}
                            transition={{ duration: 0.3 }}
                            className="text-lg font-bold ml-2 whitespace-nowrap"
                          >
                            ${basePrice.toLocaleString()}
                          </motion.span>
                        </div>
                        <div className="space-y-0.5 text-xs text-green-700 ml-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-green-600"></div>
                            <span>
                              {pageTier === "Essential" && "1-5 pages"}
                              {pageTier === "Professional" && "6-12 pages"}
                              {pageTier === "Enterprise" && "13-20 pages"}
                              {pageTier === "Premium" && "20+ pages"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-green-600"></div>
                            <span>{includedAdvancedFeatures === Infinity ? 'Unlimited' : includedAdvancedFeatures} advanced {includedAdvancedFeatures === 1 ? 'feature' : 'features'} included</span>
                          </div>
                        </div>
                      </div>

                      {/* Users - Unlimited */}
                      <div className="flex justify-between items-start py-0.5">
                        <span className="text-sm flex-grow">
                          {users} {users === 1 ? 'User' : 'Users'} <span className="text-green-700 text-xs">(no per-user fees)</span>
                        </span>
                        <span className="text-base font-bold ml-2 whitespace-nowrap text-green-700">
                          Unlimited
                        </span>
                      </div>

                      {/* Separation between included and additional features */}
                      {(() => {
                        const advancedFeatures = features.filter(f => f.enabled && f.price > 0);
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

                            {/* Separator for Additional Costs */}
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
                      })()}

                      <div className="border-t-2 border-green-300 pt-3 mt-3">
                        {/* Show quiz discount if applicable */}
                        {prefilledFromQuiz && quizDiscount > 0 && (
                          <div className="mb-3 p-2.5 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border border-yellow-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">🎉</span>
                                <span className="text-sm font-semibold text-yellow-900">Quiz Completion Discount ({QUIZ_DISCOUNT_PERCENT}%)</span>
                              </div>
                              <span className="text-base font-bold text-yellow-900">
                                -${quizDiscount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-green-900">
                            One-Time Investment:
                          </span>
                          <div className="text-right">
                            {prefilledFromQuiz && quizDiscount > 0 && (
                              <div className="text-sm text-green-700 line-through mb-1">
                                ${basePrice.toLocaleString()}
                              </div>
                            )}
                            <motion.span
                              key={`total-${totalPrice}`}
                              initial={{ color: '#15803d' }}
                              animate={{ color: '#14532d' }}
                              transition={{ duration: 0.3 }}
                              className="text-4xl font-bold text-green-800"
                            >
                              ${totalPrice.toLocaleString()}
                            </motion.span>
                          </div>
                        </div>
                        <p className="text-sm text-green-700 text-right">
                          Timeline: {calculateTimeline()}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-green-300 space-y-2 text-sm text-green-800">
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" /> Unlimited users - no extra charge
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" /> Full source code ownership
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" /> No monthly payments
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" /> Unlimited customization
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Calculate Savings Button */}
                  {!showComparison && (
                    <Button
                      onClick={handleShowComparison}
                      disabled={isCalculating}
                      size="lg"
                      className="w-full text-base font-semibold"
                    >
                      {isCalculating ? "Calculating..." : "💰 See How Much You Save"}
                    </Button>
                  )}

                  {/* Get Quote Button - shown when not in comparison mode */}
                  {!showComparison && (
                    <div className="pt-4 border-t-2 border-slate-200 space-y-3">
                      <Button
                        onClick={handleGetQuote}
                        size="lg"
                        className="w-full text-lg py-6 font-semibold"
                      >
                        Get Your Free Quote →
                      </Button>
                      <Button
                        onClick={() => {
                          document.getElementById('pricing-tiers')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full text-base py-5"
                      >
                        See Our Pricing Options
                      </Button>
                      <p className="text-center text-sm text-slate-600">
                        No commitment required • Response within 24 hours
                      </p>
                    </div>
                  )}
                </div>
                {/* End RIGHT COLUMN */}
              </div>
              {/* End 2-column grid */}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
