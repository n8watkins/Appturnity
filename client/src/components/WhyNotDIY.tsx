import { motion } from "framer-motion";
import { Code2, Zap, Shield, Rocket, Sparkles, Crown } from "lucide-react";

export default function WhyNotDIY() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Story Opening */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-20"
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
              <p className="text-white font-semibold text-sm">The DIY Trap</p>
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            You Started on Wix.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              You Deserve Better.
            </span>
          </h2>

          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            We've heard the story a hundred times: You spent weeks wrestling with a drag-and-drop builder.
            Bought premium plugins. Watched endless tutorials. And in the end? You're stuck with something
            that <span className="text-white font-semibold">feels borrowed</span>, not <span className="text-white font-semibold">owned</span>.
          </p>
        </motion.div>

        {/* The Shift */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Here's What Changes When You Work With Us
            </h3>
            <p className="text-lg text-slate-300">
              Not just a better website. A fundamental shift in how you own and grow online.
            </p>
          </motion.div>

          {/* Feature Cards - Clean & Poignant */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
            {[
              {
                icon: Crown,
                title: "You'll Own Every Line of Code",
                description: "No monthly hostage fees. No platform lock-in. Export it, modify it, sell it—this is YOURS. The code, the design, the future. True ownership, not a rental agreement that bleeds your business dry.",
                gradient: "from-yellow-500 to-orange-600"
              },
              {
                icon: Zap,
                title: "Built With Tech That Actually Matters",
                description: "React. TypeScript. The same stack that powers Netflix and Airbnb. Not some dying drag-and-drop relic from 2010. Lightning-fast, modern, and built to last a decade—not break after the next update.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Code2,
                title: "Zero Plugin Nightmares",
                description: "Everything custom-built into ONE system. No juggling 47 plugins that conflict. No surprise $29/month fees that stack up. No compatibility breakdowns at 3am. Just clean, professional code that works.",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-100"></div>

                <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-300 flex flex-col">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-white mb-4 leading-snug">
                    {feature.title}
                  </h4>

                  <p className="text-slate-300 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Powerful Closing */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-primary/30 rounded-3xl p-10 md:p-14 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Stop Renting Your Future.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
                  Start Owning It.
                </span>
              </h3>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Your competitors are still dragging and dropping. You'll have enterprise-grade technology,
                custom-built for your business, and you'll <span className="font-bold text-white">own every line of code</span>.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="text-white">✓ No Monthly Ransom</span>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="text-white">✓ Source Code Included</span>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="text-white">✓ Modern Tech Stack</span>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="text-white">✓ Built for Speed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
