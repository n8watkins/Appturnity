import { motion } from "framer-motion";
import { Clock, DollarSign, Sparkles, TrendingUp, Wrench, Users } from "lucide-react";

export default function WhyNotDIY() {
  const comparisons = [
    {
      icon: Clock,
      diy: "Weeks learning the platform, struggling with templates",
      pro: "We handle everything while you focus on your business",
      label: "Your Time"
    },
    {
      icon: DollarSign,
      diy: "$30-100/month forever, plus plugin fees that add up",
      pro: "One upfront cost, predictable $50/month—no surprises",
      label: "True Cost"
    },
    {
      icon: Sparkles,
      diy: "Cookie-cutter templates that look like everyone else",
      pro: "Custom design that reflects your brand perfectly",
      label: "Design Quality"
    },
    {
      icon: TrendingUp,
      diy: "Generic layouts not optimized for conversions",
      pro: "Built to drive leads and grow your business",
      label: "Results"
    },
    {
      icon: Wrench,
      diy: "You're stuck fixing bugs and updates yourself",
      pro: "We maintain, update, and support everything",
      label: "Maintenance"
    },
    {
      icon: Users,
      diy: "You're the designer, developer, and support team",
      pro: "Professional team with years of experience",
      label: "Expertise"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Why Not Just Build It Yourself?
          </h2>
          <p className="text-lg text-slate-600">
            DIY platforms seem affordable at first—but your time is valuable, and your business deserves better than a template.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {comparisons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-slate-900 mb-3">{item.label}</h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-16 text-xs font-medium text-slate-500 pt-0.5">
                            DIY
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {item.diy}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-16 text-xs font-medium text-primary pt-0.5">
                            WITH US
                          </div>
                          <p className="text-sm text-slate-900 font-medium leading-relaxed">
                            {item.pro}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-12 p-8 bg-primary/5 border-2 border-primary/20 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                The Real Question: What's Your Time Worth?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Spending 40+ hours learning a platform and building your site yourself might "save" money upfront—but that's 40 hours you could spend growing your business, serving clients, or closing deals. We handle the technical work so you can focus on what you do best.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
