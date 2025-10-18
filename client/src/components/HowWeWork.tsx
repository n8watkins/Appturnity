import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Palette, Rocket, Crown, Heart, ArrowDown } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "We Map Your Vision",
    description:
      "One focused call. We dig into what makes your business different and how to translate that into a landing page that actually converts.",
    Icon: MapPin,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "See It Before It's Built",
    description:
      "Custom designs in your inbox within days. Not 'close enough' templates. Your brand, your style, your message—exactly right.",
    Icon: Palette,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Ship in Weeks, Not Quarters",
    description:
      "We build fast with enterprise tech. React. TypeScript. You get updates, not excuses. Progress you can see, timelines we hit.",
    Icon: Rocket,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Own Every Line of Code",
    description:
      "Launch day, you get it all. Source code, assets, documentation. No subscriptions holding you hostage. True ownership.",
    Icon: Crown,
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    id: 5,
    title: "Your Tech Partner for Life",
    description:
      "Market changes? New offer? Need a tweak? We handle it in hours. No tickets, no waiting, no drama.",
    Icon: Heart,
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-24 bg-slate-50 scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            How We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Build
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            From first call to launch day—here's how we turn your vision into reality.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.id}
                className={`relative mb-10 md:mb-14 last:mb-0 ${isEven ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"} md:max-w-xl`}
                initial={{ opacity: 0, y: 60, rotate: isEven ? -8 : 8, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotate: isEven ? 2 : -2, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                {/* Giant Background Number */}
                <div className="absolute -top-6 -left-3 md:-left-8 text-[120px] md:text-[160px] font-black text-slate-200/30 leading-none select-none pointer-events-none z-0">
                  0{step.id}
                </div>

                {/* Card */}
                <motion.div
                  className={`relative z-10 bg-white rounded-xl border-2 border-slate-200 p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] transition-shadow duration-500 group`}
                  whileHover={{ y: -8, rotate: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient Badge */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-base text-slate-600 leading-relaxed">{step.description}</p>

                  {/* Animated underline */}
                  <div className="mt-4 h-1 w-16 bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-300 group-hover:w-full"></div>
                </motion.div>

                {/* Connecting Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute -bottom-7 left-1/2 -translate-x-1/2 z-0"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 0.3, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 3 L15 23 M15 23 L11 19 M15 23 L19 19"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                        strokeDasharray="3 3"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-20 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            className="mb-4 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-xl">👇</span>
            <p className="text-base text-slate-600 font-medium">Ready to get started?</p>
          </motion.div>

          <Button
            size="lg"
            className="font-medium text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all group relative"
            asChild
          >
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact", undefined, true)}
              className="inline-flex items-center gap-3"
            >
              <span>Start Your Project</span>
              <motion.div
                initial={{ y: 0 }}
                whileInView={{ y: [0, 6, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
              >
                <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </motion.div>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
