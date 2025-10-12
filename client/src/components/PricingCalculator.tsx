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
    name: "Analytics",
    description: "Track visitors and conversions",
    price: 0,
    saasMonthly: 49,
    enabled: true,
    category: "Always Included",
    alwaysIncluded: true
  },
  // Marketing & Growth
  {
    id: "seo",
    name: "SEO Optimization",
    description: "Foundation for Google rankings",
    price: 400,
    saasMonthly: 99,
    enabled: false,
    category: "Marketing & Growth"
  },
  {
    id: "forms",
    name: "Custom Lead Forms",
    description: "Advanced multi-step forms",
    price: 500,
    saasMonthly: 50,
    enabled: false,
    category: "Marketing & Growth"
  },
  // Content Management
  {
    id: "cms",
    name: "Content Management",
    description: "Easy content updates (5 users)",
    price: 800,
    saasMonthly: 149,
    enabled: false,
    category: "Content Management"
  },
  {
    id: "blog",
    name: "Blog System",
    description: "Built-in blogging platform",
    price: 600,
    saasMonthly: 29,
    enabled: false,
    category: "Content Management"
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Multiple language support",
    price: 700,
    saasMonthly: 79,
    enabled: false,
    category: "Content Management"
  },
  // User Features
  {
    id: "auth",
    name: "User Authentication",
    description: "Login, signup, password reset (up to 1000 users)",
    price: 1500,
    saasMonthly: 99,
    enabled: false,
    category: "User Features"
  },
  {
    id: "database",
    name: "Database Integration",
    description: "Secure data storage",
    price: 1200,
    saasMonthly: 79,
    enabled: false,
    category: "User Features"
  },
  // E-commerce & Payments
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Shopping cart and checkout",
    price: 2500,
    saasMonthly: 299,
    enabled: false,
    category: "E-commerce & Payments"
  },
  {
    id: "payment",
    name: "Payment Processing",
    description: "Accept credit cards",
    price: 1000,
    saasMonthly: 89,
    enabled: false,
    category: "E-commerce & Payments"
  },
  // Booking & Scheduling
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment scheduling (3 users)",
    price: 800,
    saasMonthly: 49,
    enabled: false,
    category: "Booking & Scheduling"
  },
  // Integrations & Support
  {
    id: "api",
    name: "API Integration",
    description: "Connect third-party tools",
    price: 600,
    saasMonthly: 59,
    enabled: false,
    category: "Integrations & Support"
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Real-time customer support (5 users)",
    price: 300,
    saasMonthly: 69,
    enabled: false,
    category: "Integrations & Support"
  },
  // Design & UX
  {
    id: "animations",
    name: "Advanced Animations",
    description: "Premium interactions",
    price: 400,
    saasMonthly: 0,
    enabled: false,
    category: "Design & UX"
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
      // More uniform pricing: $150 per page
      const price = 750 + ((pageCount - 1) * 150);
      let tier;
      if (pageCount <= 4) tier = "Simple Landing Page (1-4 pages)";
      else if (pageCount <= 8) tier = "Multi-Page Site (5-8 pages)";
      else if (pageCount <= 15) tier = "Complex Site (9-15 pages)";
      else tier = `Large Site (${pageCount} pages)`;
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
    <section id="pricing" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Calculate Your Investment
          </h2>
          <p className="text-lg text-slate-600">
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
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-2 h-6 w-6 text-primary" />
                Your Custom Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-[1fr_400px] gap-8">
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
                              <h3 className="text-lg font-bold text-green-900 mb-2 pb-2 border-b-2 border-green-300">
                                ✓ WHAT'S ALWAYS INCLUDED
                              </h3>
                              <p className="text-sm text-green-700">
                                Free with every project • Competitors charge extra
                              </p>
                            </div>
                          ) : category === "Marketing & Growth" ? (
                            <div className="mb-4 mt-8">
                              <h3 className="text-lg font-bold text-slate-900 mb-2 pb-2 border-b-2 border-slate-200">
                                ADVANCED FEATURES
                              </h3>
                              <p className="text-sm text-slate-600">
                                Select features to add to your project
                              </p>
                            </div>
                          ) : null}

                          {/* Category Header (for advanced features only) */}
                          {!isAlwaysIncluded && (
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <div className="h-px flex-grow bg-slate-300"></div>
                              <span>{category}</span>
                              <div className="h-px flex-grow bg-slate-300"></div>
                            </h4>
                          )}

                          {/* Features Grid */}
                          <div className={`grid ${isAlwaysIncluded ? 'grid-cols-1' : 'grid-cols-2'} gap-3 ${isAlwaysIncluded ? 'mb-6' : ''}`}>
                            {categoryFeatures.map((feature) => (
                              <motion.div
                                key={feature.id}
                                whileHover={!feature.alwaysIncluded ? { scale: 1.02 } : {}}
                                whileTap={!feature.alwaysIncluded ? { scale: 0.98 } : {}}
                              >
                                <button
                                  onClick={() => toggleFeature(feature.id)}
                                  disabled={feature.alwaysIncluded}
                                  className={`w-full text-left p-3 rounded-lg border-2 transition-all h-full ${
                                    feature.alwaysIncluded
                                      ? 'border-green-300 bg-green-50 cursor-default'
                                      : feature.enabled
                                      ? 'border-primary bg-primary/5 shadow-md'
                                      : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                      feature.alwaysIncluded
                                        ? 'bg-green-600 border-green-600'
                                        : feature.enabled
                                        ? 'bg-primary border-primary'
                                        : 'border-slate-300'
                                    }`}>
                                      {(feature.enabled || feature.alwaysIncluded) && <Check className="h-3 w-3 text-white" />}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className={`font-semibold text-sm leading-tight ${
                                          feature.alwaysIncluded ? 'text-green-900' : 'text-slate-900'
                                        }`}>
                                          {feature.name}
                                        </h4>
                                        {feature.alwaysIncluded && (
                                          <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                                            FREE
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-xs leading-snug ${
                                        feature.alwaysIncluded ? 'text-green-700' : 'text-slate-600'
                                      }`}>
                                        {feature.description}
                                      </p>
                                      {feature.alwaysIncluded && feature.saasMonthly > 0 && (
                                        <p className="text-xs text-red-700 mt-2 font-medium">
                                          Competitors charge: ${feature.saasMonthly}/mo
                                        </p>
                                      )}
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
                  <div className="bg-slate-100 p-5 rounded-xl border-2 border-slate-300 space-y-4">
                    <h4 className="text-base font-bold text-slate-900 mb-4">
                      Project Configuration
                    </h4>

                    {/* Number of Pages Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-900">
                          Number of Pages
                        </label>
                        <span className="text-base font-bold text-slate-800">
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
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>1 page</span>
                        <span>20+ pages</span>
                      </div>
                    </div>

                    {/* Number of Users Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-900">
                          Number of Users
                        </label>
                        <span className="text-base font-bold text-slate-800">
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
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>1 user</span>
                        <span>20+ users</span>
                      </div>
                    </div>
                  </div>

                  {/* Traditional SaaS Costs - Always Visible */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-300">
                    <h4 className="text-base font-bold text-red-900 mb-3 flex items-center gap-2">
                      <X className="h-5 w-5 text-red-600" />
                      Traditional SaaS (Wix, Squarespace, etc.)
                    </h4>
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
                    <h4 className="text-base font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      Your Custom Solution
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
                  <div className="pt-4 border-t-2 border-slate-200">
                    <Button
                      onClick={handleGetQuote}
                      size="lg"
                      className="w-full text-lg py-6 font-semibold"
                    >
                      Get Your Detailed Quote →
                    </Button>
                    <p className="text-center text-sm text-slate-500 mt-2">
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
