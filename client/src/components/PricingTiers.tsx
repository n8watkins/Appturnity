import { motion } from "framer-motion";
import {
  Check,
  Star,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSmoothScroll } from "@/lib/utils";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { getQuizResults } from "@/lib/quizStorage";

// Quiz discount percentage
const QUIZ_DISCOUNT_PERCENT = 10;

const pricingTiers = [
  {
    name: "Essential",
    price: "$750",
    pageRange: "1-5 pages",
    delivery: "2-3 week delivery",
    advancedCount: "+ 1 advanced feature",
    description: "Perfect for landing pages & small sites",
    popular: false,
    features: [
      "Essential features:",
      "Custom design",
      "Mobile responsive",
      "Contact forms",
      "SEO optimization",
      "SSL certificate",
      "Cloud hosting",
    ],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$1,700",
    pageRange: "6-12 pages",
    delivery: "3-4 week delivery",
    advancedCount: "+ 3 advanced features",
    description: "Most popular for growing businesses",
    popular: true,
    features: [
      "Popular advanced features:",
      "Advanced SEO & analytics",
      "Email marketing integration",
      "Multi-step forms",
      "Blog integration",
      "CRM integration",
      "Dark mode",
    ],
    highlight: true,
  },
  {
    name: "Growth",
    price: "$2,450",
    pageRange: "13-20 pages",
    delivery: "1-2 month delivery",
    advancedCount: "+ 7 advanced features",
    description: "For established businesses",
    popular: false,
    features: [
      "Popular advanced features:",
      "User authentication",
      "Payment processing",
      "File uploads",
      "API integrations",
      "Conversion tracking",
      "Advanced animations",
      "Custom illustrations",
    ],
    highlight: false,
  },
  {
    name: "Premium",
    price: "$5,500",
    pageRange: "20+ pages",
    delivery: "2-3 month delivery",
    advancedCount: "+ 15 advanced features",
    description: "Large-scale custom solutions",
    popular: false,
    features: [
      "Everything you need:",
      "E-commerce platform",
      "Multi-language support",
      "Custom integrations",
      "Dedicated support",
      "Priority delivery",
      "White-glove service",
    ],
    highlight: false,
    isUnlimited: false,
  },
];

export default function PricingTiers() {
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);
  const [hasQuizDiscount, setHasQuizDiscount] = useState(false);

  // Helper function to apply discount to a price string
  const applyDiscount = (priceString: string) => {
    const price = parseInt(priceString.replace(/\D/g, ""));
    if (isNaN(price)) return priceString;
    const discountedPrice = Math.round(price * (1 - QUIZ_DISCOUNT_PERCENT / 100));
    return `$${discountedPrice.toLocaleString()}`;
  };

  // Helper function to calculate best tier (upgrade when features exceed capacity)
  const calculateRecommendedTier = (data: any) => {
    if (!data.pageCount) return null;

    // Convert page range to numeric value
    const pageRange = data.pageCount;
    let pages = 5; // default
    if (pageRange === "1-5") pages = 3;
    else if (pageRange === "6-12") pages = 9;
    else if (pageRange === "13-20") pages = 16;
    else if (pageRange === "20+") pages = 25;
    else if (pageRange === "not-sure") pages = 8;

    // Count advanced features selected
    const advancedCount =
      data.desiredFeatures && Array.isArray(data.desiredFeatures) ? data.desiredFeatures.length : 0;

    const allTierOptions = [
      { name: "Essential", base: 750, included: 1, maxPages: 5 },
      { name: "Professional", base: 1700, included: 3, maxPages: 12 },
      { name: "Growth", base: 2450, included: 7, maxPages: 20 },
      {
        name: "Premium",
        base: 3500 + (pages > 20 ? (pages - 20) * 100 : 0),
        included: 15,
        maxPages: 999,
      },
    ];

    // Start with tier based on page count
    let currentTierIndex = allTierOptions.findIndex((t) => pages <= t.maxPages);
    if (currentTierIndex === -1) currentTierIndex = allTierOptions.length - 1;

    // Check if we need to upgrade due to features
    // Upgrade to next tier when: current tier cost > next tier base price
    for (let i = currentTierIndex; i < allTierOptions.length; i++) {
      const currentTier = allTierOptions[i];
      const extraFeatures = Math.max(0, advancedCount - currentTier.included);
      const currentCost = currentTier.base + extraFeatures * 500;

      // If there's a next tier, check if upgrading is cheaper
      if (i < allTierOptions.length - 1) {
        const nextTier = allTierOptions[i + 1];
        const nextExtraFeatures = Math.max(0, advancedCount - nextTier.included);
        const nextCost = nextTier.base + nextExtraFeatures * 500;

        // If next tier is cheaper or equal, upgrade
        if (nextCost <= currentCost) {
          continue; // Keep checking higher tiers
        }
      }

      // This tier is optimal
      return currentTier.name;
    }

    // Fallback to highest tier
    return allTierOptions[allTierOptions.length - 1].name;
  };

  // Determine recommended tier from quiz results
  useEffect(() => {
    const quizData = getQuizResults();
    if (quizData) {
      const recommended = calculateRecommendedTier(quizData);
      setRecommendedTier(recommended);
      setHasQuizDiscount(true);
    }
  }, []);

  // Listen for quiz completion events in real-time
  useEffect(() => {
    const handleQuizCompleted = (event: CustomEvent) => {
      const quizData = event.detail;

      // Validate event data before using
      if (!quizData || typeof quizData !== "object") {
        console.warn("Invalid quiz data received");
        return;
      }

      const recommended = calculateRecommendedTier(quizData);
      setRecommendedTier(recommended);
      setHasQuizDiscount(true);
    };

    window.addEventListener("quizCompleted", handleQuizCompleted as EventListener);

    return () => {
      window.removeEventListener("quizCompleted", handleQuizCompleted as EventListener);
    };
  }, []);

  // Listen for project builder configuration changes
  useEffect(() => {
    const handleProjectConfigured = (event: CustomEvent) => {
      const projectData = event.detail;

      // Validate event data
      if (!projectData || typeof projectData !== "object") {
        console.warn("Invalid project data received");
        return;
      }

      // Update recommended tier based on project builder configuration
      if (projectData.recommendedTier) {
        setRecommendedTier(projectData.recommendedTier);
        // Keep quiz discount if it was already active
        if (projectData.prefilledFromQuiz) {
          setHasQuizDiscount(true);
        }
      }
    };

    window.addEventListener("projectConfigured", handleProjectConfigured as EventListener);

    return () => {
      window.removeEventListener("projectConfigured", handleProjectConfigured as EventListener);
    };
  }, []);

  return (
    <section id="pricing-tiers" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Quiz Discount Banner */}
          {hasQuizDiscount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-full shadow-lg"
            >
              <span className="text-2xl">🎉</span>
              <div className="text-left">
                <div className="text-sm font-bold text-yellow-900">Quiz Discount Active!</div>
                <div className="text-xs text-yellow-800">
                  {QUIZ_DISCOUNT_PERCENT}% off all pricing shown below
                </div>
              </div>
            </motion.div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600">
            One-time payment. No monthly fees. You own everything.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{
                opacity: 0,
                y: 0,
              }}
              whileInView={{
                opacity: 1,
                y: recommendedTier === tier.name || (!recommendedTier && tier.popular) ? -32 : 0,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${
                recommendedTier === tier.name || (!recommendedTier && tier.popular)
                  ? "lg:scale-105"
                  : ""
              }`}
            >
              {/* Recommended Badge - takes priority when quiz is taken */}
              {recommendedTier === tier.name ? (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl whitespace-nowrap">
                    <CheckCircle2 className="h-5 w-5" />
                    RECOMMENDED FOR YOU
                  </div>
                </div>
              ) : tier.popular ? (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl whitespace-nowrap">
                    <Star className="h-5 w-5 fill-current" />
                    MOST POPULAR
                  </div>
                </div>
              ) : null}

              <div
                className={`relative h-full bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
                  recommendedTier === tier.name
                    ? "border-green-500 shadow-2xl"
                    : tier.highlight
                      ? "border-primary shadow-2xl"
                      : "border-slate-200 hover:border-primary/50"
                }`}
              >
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    {hasQuizDiscount && tier.price !== "Custom" ? (
                      <div className="space-y-1">
                        <div className="text-lg text-slate-500 line-through">{tier.price}</div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold text-primary">
                            {applyDiscount(tier.price)}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded">
                            -{QUIZ_DISCOUNT_PERCENT}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-primary">{tier.price}</span>
                    )}
                    {tier.price !== "Custom" && (
                      <span className="text-slate-600 ml-1">one-time</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{tier.description}</p>
                  {hasQuizDiscount && tier.price !== "Custom" && (
                    <p className="text-xs text-green-700 mt-1 font-medium">
                      🎉 Quiz discount applied!
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Sparkles
                      className={`h-4 w-4 flex-shrink-0 ${tier.name === "Premium" ? "text-purple-600" : "text-blue-600"}`}
                    />
                    <span
                      className={
                        tier.name === "Premium"
                          ? "text-purple-700 font-bold"
                          : "text-blue-700 font-bold"
                      }
                    >
                      {tier.advancedCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span>{tier.delivery}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span>{tier.pageRange}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {tier.features.map((feature, featureIndex) => {
                    const isSectionHeader =
                      feature.includes("Essential features:") ||
                      feature.includes("Popular advanced features:") ||
                      feature.includes("Everything you need:");

                    return (
                      <li
                        key={featureIndex}
                        className={`flex items-start gap-2 ${
                          isSectionHeader
                            ? "font-semibold text-slate-700 text-xs uppercase tracking-wide"
                            : ""
                        }`}
                      >
                        {!isSectionHeader && (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${isSectionHeader ? "" : "text-slate-700"}`}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full mt-auto ${
                    tier.highlight
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll(e as any, "contact", undefined, true);
                  }}
                >
                  {tier.price === "Custom" ? "Contact Us" : "Get Started"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Link and Caveat */}
        <motion.div
          className="text-center mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-slate-600 text-sm mb-4">
            * Popular choices shown. Not all features listed.
          </p>
          <Link href="/features">
            <a className="inline-flex items-center gap-2 text-lg text-slate-900 hover:text-primary transition-colors duration-200 group">
              <span>View Full Feature List & Details</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
