import { useState, useEffect } from "react";
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
}

const FEATURES: Feature[] = [
  {
    id: "seo",
    name: "SEO Optimization",
    description: "Foundation for Google rankings",
    price: 400,
    saasMonthly: 50,
    enabled: false
  },
  {
    id: "analytics",
    name: "Google Analytics",
    description: "Track visitors and conversions",
    price: 300,
    saasMonthly: 0,
    enabled: false
  },
  {
    id: "forms",
    name: "Custom Lead Forms",
    description: "Advanced multi-step forms",
    price: 500,
    saasMonthly: 20,
    enabled: false
  },
  {
    id: "cms",
    name: "Content Management",
    description: "Easy content updates",
    price: 800,
    saasMonthly: 50,
    enabled: false
  },
  {
    id: "blog",
    name: "Blog System",
    description: "Built-in blogging platform",
    price: 600,
    saasMonthly: 15,
    enabled: false
  },
  {
    id: "auth",
    name: "User Authentication",
    description: "Login, signup, password reset",
    price: 1500,
    saasMonthly: 29,
    enabled: false
  },
  {
    id: "database",
    name: "Database Integration",
    description: "Secure data storage",
    price: 1200,
    saasMonthly: 25,
    enabled: false
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Shopping cart and checkout",
    price: 2500,
    saasMonthly: 79,
    enabled: false
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment scheduling",
    price: 800,
    saasMonthly: 10,
    enabled: false
  },
  {
    id: "payment",
    name: "Payment Processing",
    description: "Accept credit cards",
    price: 1000,
    saasMonthly: 35,
    enabled: false
  },
  {
    id: "api",
    name: "API Integration",
    description: "Connect third-party tools",
    price: 600,
    saasMonthly: 20,
    enabled: false
  },
  {
    id: "multilang",
    name: "Multi-language",
    description: "Multiple language support",
    price: 700,
    saasMonthly: 30,
    enabled: false
  },
  {
    id: "animations",
    name: "Advanced Animations",
    description: "Premium interactions",
    price: 400,
    saasMonthly: 0,
    enabled: false
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Real-time customer support",
    price: 300,
    saasMonthly: 15,
    enabled: false
  }
];

export default function PricingCalculator() {
  const [pages, setPages] = useState(5);
  const [features, setFeatures] = useState<Feature[]>(FEATURES);
  const [prefilledFromQuiz, setPrefilledFromQuiz] = useState(false);

  // Calculate base price based on page tier
  const getBasePriceAndTier = (pageCount: number) => {
    if (pageCount <= 4) return { price: 1200, tier: "Simple Landing Page (1-4 pages)" };
    if (pageCount <= 8) return { price: 2500, tier: "Multi-Page Site (5-8 pages)" };
    if (pageCount <= 15) return { price: 4000, tier: "Complex Site (9-15 pages)" };
    return { price: 4000 + ((pageCount - 15) * 250), tier: `Large Site (${pageCount} pages)` };
  };

  const { price: basePrice, tier: pageTier } = getBasePriceAndTier(pages);

  const featuresTotal = features
    .filter(f => f.enabled)
    .reduce((sum, f) => sum + f.price, 0);

  const totalPrice = basePrice + featuresTotal;

  const saasMonthlyTotal = features
    .filter(f => f.enabled)
    .reduce((sum, f) => sum + f.saasMonthly, 0);

  const saasThreeYearTotal = saasMonthlyTotal * 36;

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

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
        if (data.estimatedPages) {
          setPages(data.estimatedPages);
          setPrefilledFromQuiz(true);
        }

        // Pre-enable features based on quiz
        if (data.desiredFeatures && Array.isArray(data.desiredFeatures)) {
          setFeatures(prev => prev.map(feature => ({
            ...feature,
            enabled: data.desiredFeatures.includes(feature.id)
          })));
        }
      } catch (error) {
        console.error('Error parsing quiz results:', error);
      }
    }
  }, []);

  const handleGetQuote = () => {
    const calculatorData = {
      pages,
      selectedFeatures: features.filter(f => f.enabled).map(f => f.id),
      basePrice,
      featuresTotal,
      totalPrice,
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
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-slate-200">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-2 h-6 w-6 text-primary" />
                Your Custom Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Configuration */}
                <div>
                  {/* Project Scope */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">
                      PROJECT SCOPE
                    </h3>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-base font-medium text-slate-700">
                          Number of Pages
                        </label>
                        <span className="text-lg font-bold text-primary">
                          {pages} {pages >= 20 ? "+" : ""}
                        </span>
                      </div>

                      <Slider
                        value={[pages]}
                        onValueChange={(value) => setPages(value[0])}
                        min={1}
                        max={20}
                        step={1}
                        className="my-4"
                      />

                      <div className="flex justify-between text-sm text-slate-500">
                        <span>1 page</span>
                        <span>20+ pages</span>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">{pageTier}</p>
                        <p className="text-xl font-bold text-blue-600 mt-1">
                          ${basePrice.toLocaleString()} base
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Features */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 pb-2 border-b-2 border-slate-200">
                      ADVANCED FEATURES
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Select features to see costs update →
                    </p>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                      {features.map((feature) => (
                        <motion.div
                          key={feature.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              feature.enabled
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                feature.enabled ? 'bg-primary border-primary' : 'border-slate-300'
                              }`}>
                                {feature.enabled && <Check className="h-3 w-3 text-white" />}
                              </div>

                              <div className="flex-grow">
                                <h4 className="font-semibold text-slate-900 text-sm mb-1">
                                  {feature.name}
                                </h4>
                                <p className="text-xs text-slate-600 mb-2">{feature.description}</p>

                                {feature.saasMonthly > 0 && (
                                  <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
                                    <p className="text-xs text-red-900">
                                      <span className="font-semibold">SaaS:</span> ${feature.saasMonthly}/mo = ${(feature.saasMonthly * 36).toLocaleString()}/3yrs
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Live Calculator */}
                <div className="md:sticky md:top-4 md:self-start space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">
                    COST COMPARISON
                  </h3>

                  {/* Traditional SaaS Costs */}
                {saasMonthlyTotal > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-300 mb-4"
                  >
                    <h4 className="text-base font-bold text-red-900 mb-3 flex items-center gap-2">
                      <X className="h-5 w-5 text-red-600" />
                      Traditional SaaS (Monthly Subscriptions)
                    </h4>
                    <div className="space-y-2 text-sm text-red-900">
                      {features.filter(f => f.enabled && f.saasMonthly > 0).map(f => (
                        <div key={f.id} className="flex justify-between items-center">
                          <span>{f.name}</span>
                          <span className="font-medium">${f.saasMonthly}/mo</span>
                        </div>
                      ))}
                      <div className="border-t-2 border-red-300 pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Per Month:</span>
                          <span className="text-lg">${saasMonthlyTotal}/mo</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-base">
                          <span className="font-bold">3-Year Total:</span>
                          <span className="text-xl font-bold text-red-600">
                            ${saasThreeYearTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-red-300 space-y-1 text-xs">
                        <p className="flex items-center gap-2 text-red-700">
                          <X className="h-3 w-3" /> No ownership - monthly forever
                        </p>
                        <p className="flex items-center gap-2 text-red-700">
                          <X className="h-3 w-3" /> Feature locked and limited
                        </p>
                        <p className="flex items-center gap-2 text-red-700">
                          <X className="h-3 w-3" /> Price increases over time
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <p className="text-sm text-blue-900">
                      👈 Select features above to see SaaS cost comparison
                    </p>
                  </div>
                )}

                {/* Your Investment */}
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-300"
                >
                  <h4 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    Your Custom Solution
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-900">
                        {pages} pages + {features.filter(f => f.enabled).length} advanced features
                      </span>
                    </div>

                    <div className="border-t-2 border-green-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-900">
                          One-Time Investment:
                        </span>
                        <motion.span
                          key={totalPrice}
                          initial={{ scale: 1.2, color: "#15803d" }}
                          animate={{ scale: 1, color: "#14532d" }}
                          className="text-3xl font-bold"
                        >
                          ${totalPrice.toLocaleString()}
                        </motion.span>
                      </div>
                      <p className="text-xs text-green-700 text-right mt-1">
                        Timeline: {calculateTimeline()} • You own everything
                      </p>
                    </div>

                    {saasMonthlyTotal > 0 && (
                      <div className="mt-4 pt-4 border-t border-green-300 space-y-1 text-xs">
                        <p className="flex items-center gap-2 text-green-800">
                          <Check className="h-3 w-3" /> Full source code ownership
                        </p>
                        <p className="flex items-center gap-2 text-green-800">
                          <Check className="h-3 w-3" /> No monthly payments
                        </p>
                        <p className="flex items-center gap-2 text-green-800">
                          <Check className="h-3 w-3" /> Unlimited customization
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Savings Highlight */}
                {saasMonthlyTotal > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white text-center"
                  >
                    <p className="text-sm font-medium mb-1">3-Year Savings</p>
                    <p className="text-4xl font-bold">
                      ${(saasThreeYearTotal - totalPrice).toLocaleString()}
                    </p>
                    <p className="text-xs mt-2 opacity-90">
                      Plus you own it forever • No monthly ransom
                    </p>
                  </motion.div>
                )}

                  <div className="mt-6">
                    <Button
                      onClick={handleGetQuote}
                      size="lg"
                      className="w-full text-lg py-6"
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
