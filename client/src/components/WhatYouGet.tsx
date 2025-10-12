import { motion } from "framer-motion";
import { Palette, TrendingUp, Shield, Settings, FileText, Target } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Palette,
    title: "Design & Brand Identity",
    tagline: "Your unique style, professionally crafted",
    gradient: "from-pink-500 to-purple-600",
    features: [
      "Custom design matched to your brand colors and style",
      "Fully responsive across phones, tablets, and desktops",
      "Lightning-fast loading (under 2 seconds)",
      "Modern animations and micro-interactions",
      "Professional typography and spacing",
      "Accessibility standards (WCAG compliant)"
    ]
  },
  {
    icon: TrendingUp,
    title: "Lead Generation & Conversion",
    tagline: "Built to turn visitors into customers",
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Custom contact and lead capture forms",
      "SEO optimization (meta tags, sitemaps, structured data)",
      "Google Analytics and conversion tracking",
      "Social media integration",
      "Strategic call-to-action placement",
      "Form submission notifications"
    ]
  },
  {
    icon: Shield,
    title: "Security & Performance",
    tagline: "Fast, secure, and always online",
    gradient: "from-green-500 to-emerald-600",
    features: [
      "SSL certificate included",
      "99.9% uptime guarantee",
      "Daily automated backups",
      "CDN for global fast loading",
      "DDoS protection",
      "Performance optimization"
    ]
  },
  {
    icon: Settings,
    title: "Technical Foundation",
    tagline: "Modern tech that scales with you",
    gradient: "from-orange-500 to-red-600",
    features: [
      "Modern tech stack (React, TypeScript)",
      "Clean, maintainable code",
      "Database integration (if needed)",
      "API integrations with third-party tools",
      "Custom CMS for easy content updates",
      "User authentication systems (if needed)"
    ]
  },
  {
    icon: FileText,
    title: "Content & SEO",
    tagline: "Get found on Google",
    gradient: "from-indigo-500 to-purple-600",
    features: [
      "SEO-friendly URL structure",
      "OpenGraph tags for social sharing",
      "Google Search Console setup",
      "Sitemap generation",
      "Blog system (optional)",
      "Multi-language support (optional)"
    ]
  },
  {
    icon: Target,
    title: "Support & Growth",
    tagline: "We're here for the long haul",
    gradient: "from-yellow-500 to-orange-600",
    features: [
      "Regular security and performance updates",
      "Content and copy updates",
      "Fast support response (under 24 hours)",
      "Training and documentation",
      "Scalable architecture for future growth",
      "Source code ownership (you own everything)"
    ]
  }
];

export default function WhatYouGet() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 rounded-full">
              <p className="text-white font-semibold text-sm">Everything Included</p>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            What You'll{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              Get
            </span>
          </h2>

          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Not just a website. A complete, professional solution built to drive results. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Category Cards - Zigzag Layout */}
        <div className="max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                className="relative mb-16 last:mb-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                <div
                  className={`relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-10 hover:border-primary/50 transition-all duration-300 group ${
                    isEven ? "" : ""
                  }`}
                >
                  <div
                    className={`flex flex-col md:flex-row gap-8 items-start ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <category.icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {category.title}
                      </h3>
                      <p className="text-lg text-slate-400 mb-6">{category.tagline}</p>

                      <ul className="space-y-3">
                        {category.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div
                              className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient} flex-shrink-0`}
                            ></div>
                            <span className="text-base md:text-lg text-slate-300 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <motion.div
          className="relative mt-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

          <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-primary/30 rounded-3xl p-10 md:p-14 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Not Sure Where to Start?
            </h3>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Take our 2-minute quiz and we'll recommend the perfect features for your business.
            </p>

            <Button
              size="lg"
              className="font-medium text-lg px-8 py-6"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll(e as any, "pricing", undefined, true);
              }}
            >
              Take the Quiz →
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
