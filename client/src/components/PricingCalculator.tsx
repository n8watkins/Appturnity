import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleSmoothScroll } from "@/lib/utils";

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
    saasMonthly: 49,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "ssl-hosting",
    name: "SSL & Premium Hosting",
    description: "HTTPS, 99.9% uptime, CDN",
    price: 0,
    saasMonthly: 25,
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
    saasMonthly: 79,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  {
    id: "contact-forms",
    name: "Contact Forms",
    description: "Forms with notifications",
    price: 0,
    saasMonthly: 15,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  // Marketing & Growth
  {
    id: "seo",
    name: "SEO",
    description: "Search optimization",
    price: 400,
    saasMonthly: 99,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "forms",
    name: "Custom Forms",
    description: "Multi-step forms",
    price: 500,
    saasMonthly: 50,
    enabled: false,
    category: "Advanced Features"
  },
  // Content Management
  {
    id: "cms",
    name: "CMS",
    description: "Content management",
    price: 800,
    saasMonthly: 149,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "blog",
    name: "Blog",
    description: "Blogging platform",
    price: 600,
    saasMonthly: 29,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Language support",
    price: 700,
    saasMonthly: 79,
    enabled: false,
    category: "Advanced Features"
  },
  // User Features
  {
    id: "auth",
    name: "User Authentication",
    description: "Login & signup",
    price: 1500,
    saasMonthly: 99,
    enabled: false,
    category: "Advanced Features"
  },
  // E-commerce & Payments
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Cart & checkout",
    price: 2500,
    saasMonthly: 299,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "payment",
    name: "Payments",
    description: "Card processing",
    price: 1000,
    saasMonthly: 89,
    enabled: false,
    category: "Advanced Features"
  },
  // Booking & Scheduling
  {
    id: "booking",
    name: "Booking",
    description: "Scheduling system",
    price: 800,
    saasMonthly: 49,
    enabled: false,
    category: "Advanced Features"
  },
  // Integrations & Support
  {
    id: "api",
    name: "API Integration",
    description: "Third-party tools",
    price: 600,
    saasMonthly: 59,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Customer support",
    price: 300,
    saasMonthly: 69,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer management",
    price: 900,
    saasMonthly: 120,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "cdn",
    name: "CDN",
    description: "Content delivery",
    price: 300,
    saasMonthly: 45,
    enabled: false,
    category: "Advanced Features"
  },
  {
    id: "ai",
    name: "Generative AI",
    description: "AI features",
    price: 1200,
    saasMonthly: 150,
    enabled: false,
    category: "Advanced Features"
  },
  // Design & UX
  {
    id: "animations",
    name: "Animations",
    description: "Premium effects",
    price: 400,
    saasMonthly: 0,
    enabled: false,
    category: "Advanced Features"
  }
];

export default function PricingCalculator() {
  const [pages, setPages] = useState(5);
  const [users, setUsers] = useState(3);
  const [features, setFeatures] = useState<Feature[]>(FEATURES);
  const [prefilledFromQuiz, setPrefilledFromQuiz] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Memoize calculations to prevent unnecessary re-renders
  const { basePrice, pageTier } = useMemo(() => {
    const getBasePriceAndTier = (pageCount: number) => {
      // Pricing aligned with pricing tiers structure
      let price;
      let tier;

      if (pageCount <= 5) {
        price = 750; // Base price for Essential tier
        tier = "Essential (1-5 pages)";
      } else if (pageCount <= 12) {
        price = 1700; // Base price for Professional tier
        tier = "Professional (6-12 pages)";
      } else if (pageCount <= 20) {
        price = 2450; // Base price for Growth tier
        tier = "Growth (13-20 pages)";
      } else {
        price = 3500 + ((pageCount - 20) * 100); // Premium tier with custom pricing
        tier = `Premium (${pageCount} pages)`;
      }

      return { price, tier };
    };
    const { price, tier } = getBasePriceAndTier(pages);
    return { basePrice: price, pageTier: tier };
  }, [pages]);

  const featuresTotal = useMemo(() =>
    features
      .filter(f => f.enabled)
      .reduce((sum, f) => sum + f.price, 0),
    [features]
  );

  const totalPrice = useMemo(() => basePrice + featuresTotal, [basePrice, featuresTotal]);

  // Calculate SaaS costs with per-user scaling (memoized)
  const saasPageCost = useMemo(() => pages * 15, [pages]); // $15/page/month for SaaS platforms
  const saasBasePlatformCost = useMemo(() => 23 * users, [users]); // $23/user/month minimum

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

  // Check for quiz prefill on mount
  useEffect(() => {
    const quizResults = localStorage.getItem('quizResults');
    if (quizResults) {
      try {
        const data = JSON.parse(quizResults);

        // Prefill pages
        if (data.estimatedPages) {
          setPages(data.estimatedPages);
          setPrefilledFromQuiz(true);
        }

        // Prefill users/team size
        if (data.teamSize || data.users) {
          setUsers(data.teamSize || data.users);
          setPrefilledFromQuiz(true);
        }

        // Pre-enable features based on quiz
        if (data.desiredFeatures && Array.isArray(data.desiredFeatures)) {
          setFeatures(prev => prev.map(feature => ({
            ...feature,
            enabled: data.desiredFeatures.includes(feature.id)
          })));
          setPrefilledFromQuiz(true);
        }
      } catch (error) {
        console.error('Error parsing quiz results:', error);
      }
    }
  }, []);

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
            Calculate Your Investment
          </h2>
          <p className="text-lg text-slate-300">
            See exactly what you'll pay upfront. No hidden fees. No monthly ransom.
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
          <Card className="shadow-lg border border-slate-600/50 bg-slate-700/60 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/30 pb-4">
              <CardTitle className="flex items-center text-xl text-white font-semibold">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Your Custom Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-[1fr_450px] gap-8">
                {/* LEFT COLUMN - Advanced Features */}
                <div>
                  <div className="space-y-6">
                    {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
                      const isAlwaysIncluded = category === "Always Included";

                      return (
                        <div key={category}>
                          {/* Section Header */}
                          {isAlwaysIncluded ? (
                            <div className="mb-4">
                              <div className="pb-2 border-b border-emerald-500/30">
                                <h3 className="text-lg font-bold text-emerald-400">
                                  ✓ ALWAYS INCLUDED
                                </h3>
                              </div>
                            </div>
                          ) : category === "Advanced Features" ? (
                            <div className="mb-4 mt-8">
                              <div className="pb-2 border-b border-slate-600/30">
                                <h3 className="text-lg font-bold text-white">
                                  ADVANCED FEATURES
                                </h3>
                              </div>
                            </div>
                          ) : null}

                          {/* Features Grid */}
                          <div className={`grid grid-cols-2 gap-3 ${isAlwaysIncluded ? 'mb-6' : ''}`}>
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
                                      ? 'border-emerald-500/40 bg-emerald-950/30 cursor-default'
                                      : feature.enabled
                                      ? 'border-primary/60 bg-primary/10'
                                      : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                      feature.alwaysIncluded
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : feature.enabled
                                        ? 'bg-primary border-primary'
                                        : 'border-slate-500'
                                    }`}>
                                      {(feature.enabled || feature.alwaysIncluded) && <Check className="h-3 w-3 text-white" />}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                      <h4 className={`font-medium text-sm leading-tight mb-0.5 ${
                                        feature.alwaysIncluded ? 'text-emerald-300' : 'text-white'
                                      }`}>
                                        {feature.name}
                                      </h4>
                                      <p className={`text-xs leading-snug ${
                                        feature.alwaysIncluded ? 'text-emerald-200/70' : 'text-slate-400'
                                      }`}>
                                        {feature.description}
                                      </p>
                                    </div>
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

                  {/* Project Configuration Sliders */}
                  <div className="bg-slate-700/50 p-5 rounded-xl space-y-4">
                    <h4 className="text-lg font-bold text-white mb-4">
                      Project Configuration
                    </h4>

                    {/* Number of Pages Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">
                          Number of Pages
                        </label>
                        <span className="text-base font-bold text-white">
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
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>1 page</span>
                        <span>20+ pages</span>
                      </div>
                    </div>

                    {/* Number of Users Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-200">
                          Number of Users
                        </label>
                        <span className="text-base font-bold text-white">
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
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>1 user</span>
                        <span>20+ users</span>
                      </div>
                    </div>
                  </div>

                  {/* Traditional SaaS Costs - Always Visible */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-300">
                    <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                      <X className="h-5 w-5 text-red-600" />
                      Traditional SaaS
                    </h4>
                    <p className="text-xs text-red-800 mb-3 italic">
                      * These are estimates for what these additional features can cost
                    </p>
                    <div className="space-y-2 text-sm text-red-900">
                      {/* Pages Cost */}
                      <div className="flex justify-between items-start">
                        <span className="text-xs flex-grow">
                          {pages} {pages === 1 ? 'Page' : 'Pages'}
                          <span className="text-red-700 block text-xs">${pages} × $15 per page</span>
                        </span>
                        <motion.span
                          key={`pages-${saasPageCost}`}
                          initial={{ scale: 1.2, color: '#dc2626' }}
                          animate={{ scale: 1, color: '#7f1d1d' }}
                          transition={{ duration: 0.3 }}
                          className="font-medium ml-2 whitespace-nowrap"
                        >
                          ${saasPageCost}/mo
                        </motion.span>
                      </div>

                      {/* Users Cost */}
                      <div className="flex justify-between items-start">
                        <span className="text-xs flex-grow">
                          Platform Access ({users} {users === 1 ? 'user' : 'users'})
                          <span className="text-red-700 block text-xs">${users} × $23 per user</span>
                        </span>
                        <motion.span
                          key={`users-${saasBasePlatformCost}`}
                          initial={{ scale: 1.2, color: '#dc2626' }}
                          animate={{ scale: 1, color: '#7f1d1d' }}
                          transition={{ duration: 0.3 }}
                          className="font-medium ml-2 whitespace-nowrap"
                        >
                          ${saasBasePlatformCost}/mo
                        </motion.span>
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
                          <div key={f.id} className="flex justify-between items-start">
                            <span className="text-xs flex-grow">
                              {f.name}
                              {isScaling && additionalUsers > 0 && (
                                <span className="text-red-700 block text-xs">+${(additionalUsers * (f.saasMonthly * 0.5)).toFixed(0)} for {additionalUsers} extra users</span>
                              )}
                            </span>
                            <motion.span
                              key={`${f.id}-${featureCost}`}
                              initial={{ scale: 1.2, color: '#dc2626' }}
                              animate={{ scale: 1, color: '#7f1d1d' }}
                              transition={{ duration: 0.3 }}
                              className="font-medium ml-2 whitespace-nowrap"
                            >
                              ${featureCost.toFixed(0)}/mo
                            </motion.span>
                          </div>
                        );
                      })}

                      <div className="border-t-2 border-red-300 pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Per Month:</span>
                          <motion.span
                            key={`total-monthly-${saasMonthlyTotal}`}
                            initial={{ scale: 1.2, color: '#dc2626' }}
                            animate={{ scale: 1, color: '#7f1d1d' }}
                            transition={{ duration: 0.3 }}
                            className="text-lg"
                          >
                            ${Math.round(saasMonthlyTotal)}/mo
                          </motion.span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-base">
                          <span className="font-bold">3-Year Total:</span>
                          <motion.span
                            key={`total-3year-${saasThreeYearTotal}`}
                            initial={{ scale: 1.2, color: '#dc2626' }}
                            animate={{ scale: 1, color: '#991b1b' }}
                            transition={{ duration: 0.3 }}
                            className="text-xl font-bold text-red-600"
                          >
                            ${Math.round(saasThreeYearTotal).toLocaleString()}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your Investment Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300">
                    <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      Your Solution
                    </h4>

                    <div className="space-y-2 text-sm text-green-900">
                      {/* Pages Cost */}
                      <div className="flex justify-between items-start">
                        <span className="text-xs flex-grow">
                          {pageTier}
                          <span className="text-green-700 block text-xs">{pages} {pages === 1 ? 'page' : 'pages'} included</span>
                        </span>
                        <motion.span
                          key={`our-pages-${basePrice}`}
                          initial={{ scale: 1.2, color: '#15803d' }}
                          animate={{ scale: 1, color: '#14532d' }}
                          transition={{ duration: 0.3 }}
                          className="font-medium ml-2 whitespace-nowrap"
                        >
                          ${basePrice.toLocaleString()}
                        </motion.span>
                      </div>

                      {/* Users - Free */}
                      <div className="flex justify-between items-start">
                        <span className="text-xs flex-grow">
                          {users} {users === 1 ? 'User' : 'Users'}
                          <span className="text-green-700 block text-xs">Unlimited users - no per-user fees</span>
                        </span>
                        <span className="font-bold ml-2 whitespace-nowrap text-green-700">
                          FREE
                        </span>
                      </div>

                      {/* Feature Costs */}
                      {features.filter(f => f.enabled && f.price > 0).map(f => (
                        <div key={f.id} className="flex justify-between items-start">
                          <span className="text-xs flex-grow">{f.name}</span>
                          <span className="font-medium ml-2 whitespace-nowrap">
                            ${f.price.toLocaleString()}
                          </span>
                        </div>
                      ))}

                      <div className="border-t-2 border-green-300 pt-2 mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-semibold text-green-900">
                            One-Time Investment:
                          </span>
                          <motion.span
                            key={`total-${totalPrice}`}
                            initial={{ scale: 1.2, color: '#15803d' }}
                            animate={{ scale: 1, color: '#14532d' }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl font-bold text-green-800"
                          >
                            ${totalPrice.toLocaleString()}
                          </motion.span>
                        </div>
                        <p className="text-xs text-green-700 text-right">
                          Timeline: {calculateTimeline()}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-green-300 space-y-2 text-xs text-green-800">
                        <p className="flex items-center gap-2">
                          <Check className="h-3 w-3" /> Unlimited users - no extra charge
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-3 w-3" /> Full source code ownership
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-3 w-3" /> No monthly payments
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-3 w-3" /> Unlimited customization
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Calculate Savings Button & Result */}
                  {saasMonthlyTotal > 0 && (
                    <>
                      <Button
                        onClick={() => setShowComparison(!showComparison)}
                        variant={showComparison ? "secondary" : "default"}
                        size="lg"
                        className="w-full text-base font-semibold"
                      >
                        {showComparison ? "Hide Savings" : "Calculate Savings →"}
                      </Button>

                      {/* Savings Highlight (shown on demand) */}
                      <AnimatePresence>
                        {showComparison && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white text-center shadow-2xl"
                          >
                            <p className="text-sm font-medium mb-1 uppercase tracking-wide">3-Year Savings</p>
                            <p className="text-5xl font-bold mb-2">
                              ${(saasThreeYearTotal - totalPrice).toLocaleString()}
                            </p>
                            <div className="h-px bg-white/30 my-3"></div>
                            <p className="text-sm opacity-90 leading-relaxed">
                              Plus you own it forever • No monthly ransom
                            </p>
                            <p className="text-xs opacity-75 mt-2">
                              That's <strong>${Math.round((saasThreeYearTotal - totalPrice) / 36).toLocaleString()}/month</strong> saved over 3 years
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* Get Quote Button */}
                  <div className="pt-4 border-t-2 border-slate-600">
                    <Button
                      onClick={handleGetQuote}
                      size="lg"
                      className="w-full text-lg py-6 font-semibold"
                    >
                      Get Your Detailed Quote →
                    </Button>
                    <p className="text-center text-sm text-slate-400 mt-2">
                      Free consultation, no pressure
                    </p>
                  </div>
                </div>
                {/* End RIGHT COLUMN */}
              </div>
              {/* End 2-column grid */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
