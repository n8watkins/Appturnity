import { motion } from "framer-motion";
import { Check, Star, ArrowRight, Sparkles, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSmoothScroll } from "@/lib/utils";
import { Link } from "wouter";

const pricingTiers = [
  {
    name: "Essential",
    price: "$750",
    pageRange: "1-4 pages",
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
      "Cloud hosting"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: "$1,700",
    pageRange: "5-8 pages",
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
      "Dark mode"
    ],
    highlight: true
  },
  {
    name: "Growth",
    price: "$2,450",
    pageRange: "9-15 pages",
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
      "Custom illustrations"
    ],
    highlight: false
  },
  {
    name: "Premium",
    price: "Custom",
    pageRange: "16+ pages",
    delivery: "Custom timeline",
    advancedCount: "Unlimited advanced features",
    description: "Large-scale custom solutions",
    popular: false,
    features: [
      "Everything you need:",
      "E-commerce platform",
      "Multi-language support",
      "Custom integrations",
      "Dedicated support",
      "Priority delivery",
      "White-glove service"
    ],
    highlight: false,
    isUnlimited: true
  }
];

export default function PricingTiers() {
  return (
    <section id="pricing-tiers" className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-300">
            One-time payment. No monthly fees. You own everything.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${tier.highlight ? "lg:-translate-y-4" : ""}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div
                className={`relative h-full bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
                  tier.highlight
                    ? "border-primary shadow-2xl"
                    : "border-slate-200 hover:border-primary/50"
                }`}
              >
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-slate-600 ml-1">one-time</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{tier.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Sparkles className={`h-4 w-4 flex-shrink-0 ${tier.isUnlimited ? "text-purple-600" : "text-blue-600"}`} />
                    <span className={tier.isUnlimited ? "text-purple-700 font-bold" : "text-blue-700 font-bold"}>{tier.advancedCount}</span>
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
                          isSectionHeader ? "font-semibold text-slate-700 text-xs uppercase tracking-wide" : ""
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
          <p className="text-slate-300 text-sm mb-4">
            * Popular choices shown. Not all features listed.
          </p>
          <Link href="/features">
            <a className="inline-flex items-center gap-2 text-lg text-white hover:text-primary transition-colors duration-200 group">
              <span>View Full Feature List & Details</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
