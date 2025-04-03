import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Apps that just <span className="text-primary">work</span>, without the bloat
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              We build custom apps for people who just want to get stuff done. No feature overload, no per-seat pricing — just simple, effective tools with a flat monthly fee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="font-medium"
                asChild
              >
                <a href="#contact">Get Started</a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-medium"
                asChild
              >
                <a href="#how-it-works">Learn How It Works</a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="App design process" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
