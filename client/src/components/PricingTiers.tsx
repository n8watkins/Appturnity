import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSmoothScroll } from "@/lib/utils";

const pricingTiers = [
  {
    name: "Starter",
    price: "$750",
    description: "Perfect for simple landing pages",
    popular: false,
    features: [
      "1-4 pages",
      "Mobile responsive design",
      "SSL & premium hosting",
      "Basic SEO setup",
      "Contact forms",
      "Analytics & tracking",
      "Social media integration",
      "99.9% uptime guarantee",
      "Full source code ownership",
      "2-3 week delivery"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: "$1,500",
    description: "Most popular for growing businesses",
    popular: true,
    features: [
      "5-8 pages",
      "Everything in Starter, plus:",
      "Advanced SEO optimization",
      "Custom lead forms",
      "Blog system",
      "Email notifications",
      "Performance optimization",
      "CDN & daily backups",
      "Priority support",
      "3-4 week delivery"
    ],
    highlight: true
  },
  {
    name: "Business",
    price: "$2,500",
    description: "For complex sites with custom features",
    popular: false,
    features: [
      "9-15 pages",
      "Everything in Professional, plus:",
      "Content management system",
      "User authentication",
      "Database integration",
      "Custom API integrations",
      "Advanced animations",
      "Multi-language support",
      "Dedicated support",
      "1-2 month delivery"
    ],
    highlight: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Large-scale solutions tailored to you",
    popular: false,
    features: [
      "16+ pages",
      "Everything in Business, plus:",
      "E-commerce functionality",
      "Payment processing",
      "Booking system",
      "Live chat integration",
      "Custom features & integrations",
      "Scalable architecture",
      "White-glove support",
      "Custom timeline"
    ],
    highlight: false
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
              className={`relative ${tier.highlight ? "pt-8" : "pt-4"}`}
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
                className={`relative h-full bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  tier.highlight
                    ? "border-primary lg:scale-105"
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

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => {
                    const isSectionHeader = feature.includes("Everything in") || feature.includes("plus:");
                    return (
                      <li
                        key={featureIndex}
                        className={`flex items-start gap-2 ${
                          isSectionHeader ? "mt-4 pt-3 border-t border-slate-200 font-semibold text-slate-700" : ""
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
                  className={`w-full ${
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

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-slate-300 mb-4 text-lg">
            Not sure which plan is right for you?
          </p>
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
            onClick={(e) => {
              e.preventDefault();
              handleSmoothScroll(e as any, "quiz", undefined, true);
            }}
          >
            Take Our Quick Quiz →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
