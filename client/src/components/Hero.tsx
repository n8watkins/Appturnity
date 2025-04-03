import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium">Transform your business</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Your <span className="text-primary">opportunity</span> for better apps
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              We build custom apps for businesses seeking simplicity and efficiency. No feature overload, no per-seat pricing — just powerful, streamlined solutions with predictable flat monthly fees.
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
            className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="App development opportunity" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent mix-blend-multiply"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-xs text-center transform -rotate-3 hover:rotate-0 transition-all duration-300">
                <h3 className="font-bold text-xl mb-2 text-primary">Apps Reimagined</h3>
                <p className="text-slate-700 text-sm">Simple, powerful, and tailored exactly to your needs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
