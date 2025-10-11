import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { handleSmoothScroll } from "@/lib/utils";
import QuizCTA from "@/components/QuizCTA";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white select-none">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 select-none">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Modern designs, real results</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Professional <br className="hidden md:block" /> <span className="text-primary relative">
            landing pages
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C54.5 2.5 150.5 1.5 299 11.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30"/>
                </svg>
              </span> <br className="hidden md:block" />
              for  growing <span className="lg:block">businesses 🚀</span> 
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl">
            Delivering modern designs that drive leads and build trust.
            </p>
            
            <div className="space-y-4 mb-8">
  {[
    { title: "Upfront Pricing", description: "No monthly traps or surprise costs" },
    { title: "Lead-Driven Design", description: "Built to drive calls and inquiries" },
    { title: "Tailored to You", description: "Landing pages crafted for your brand and goals" },
  ].map((item, i) => (
    <motion.div 
      key={i}
      className="flex items-start gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.7 + (i * 0.1) }}
    >
      <div className="mt-1 bg-green-100 rounded-full p-0.5">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <span className="text-slate-700">
        <span className="font-semibold">{item.title}:</span> {item.description}
      </span>
    </motion.div>
  ))}
</div>

            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="font-medium group"
                asChild
              >
                <a 
                  href="#contact" 
                  className="flex items-center gap-2"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                >
                  Get Started 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-medium"
                asChild
              >
                <a 
                  href="#pricing" 
                  onClick={(e) => handleSmoothScroll(e, "pricing")}
                >
                  See Pricing
                </a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Main image */}
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="App development team" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/30 to-transparent mix-blend-multiply"></div>
            
            {/* Floating device mockups */}
            <div className="absolute inset-0 flex items-center justify-center md:justify-start p-4 md:p-0">
              <div className="relative w-full md:max-w-sm h-full md:h-auto">
                {/* Desktop mockup - hidden on mobile, shown on md+ */}
                <motion.div
                  className="hidden md:block absolute -top-16 -right-5 w-72 h-48 bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="h-8 bg-slate-100 border-b flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-3">
                    <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-20 bg-slate-100 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                </motion.div>

                {/* Mobile mockup - adjusted for mobile view */}
                <motion.div
                  className="absolute bottom-4 left-4 md:bottom-8 md:-left-5 w-28 md:w-36 h-52 md:h-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="h-4 md:h-5 bg-slate-800 flex justify-center items-end pb-0.5">
                    <div className="w-16 md:w-20 h-1 md:h-1.5 bg-slate-600 rounded"></div>
                  </div>
                  <div className="p-1.5 md:p-2">
                    <div className="h-2 md:h-3 w-1/2 bg-slate-200 rounded mb-1.5 md:mb-2"></div>
                    <div className="h-20 md:h-24 bg-primary/10 rounded mb-1.5 md:mb-2"></div>
                    <div className="space-y-1 md:space-y-1.5">
                      <div className="h-2 md:h-3 bg-slate-200 rounded"></div>
                      <div className="h-2 md:h-3 bg-slate-200 rounded"></div>
                      <div className="h-2 md:h-3 w-2/3 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Quiz CTA Card - centered in image overlay */}
                <QuizCTA
                  variant="card"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-80 md:rotate-2 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
