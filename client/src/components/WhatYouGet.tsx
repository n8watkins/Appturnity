import { motion } from "framer-motion";
import { Palette, TrendingUp, Shield, Target, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Palette,
    title: "Design & Brand Identity",
    tagline: "Your unique style, professionally crafted",
    gradient: "from-pink-500 to-purple-600",
    features: [
      "Custom design matched to your brand",
      "Fully responsive across all devices",
      "Lightning-fast performance optimized",
      "Modern animations and interactions"
    ]
  },
  {
    icon: TrendingUp,
    title: "Lead Generation & Conversion",
    tagline: "Built to turn visitors into customers",
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Custom contact and lead capture forms",
      "SEO optimization and Google Analytics",
      "Social media integration",
      "Strategic call-to-action placement"
    ]
  },
  {
    icon: Shield,
    title: "Security & Hosting",
    tagline: "Fast, secure, and always online",
    gradient: "from-green-500 to-emerald-600",
    features: [
      "SSL certificate included",
      "Cloud hosting with 99.9% uptime",
      "Regular security updates",
      "Performance monitoring"
    ]
  },
  {
    icon: Target,
    title: "Support & Ownership",
    tagline: "We're here for the long haul",
    gradient: "from-orange-500 to-red-600",
    features: [
      "Full source code ownership",
      "Regular updates and maintenance",
      "Fast support (under 24 hours)",
      "Documentation and training"
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
              Get
            </span>
          </h2>

          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Not just a website. A complete, professional solution built to drive results. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Category Cards - Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

              <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group h-full">
                {/* Icon and Title Section */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-400">{category.tagline}</p>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5">
                      <div
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${category.gradient} flex-shrink-0`}
                      ></div>
                      <span className="text-sm text-slate-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Features Link */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/features"
            className="inline-flex items-center gap-2 text-lg text-slate-300 hover:text-white transition-colors duration-200 group"
          >
            <span>See Full Feature List & Details</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
