import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Consultation",
    description: "We meet to understand exactly what you need. No jargon, no technical barriers - just a conversation about your goals."
  },
  {
    id: 2,
    title: "Design & Build",
    description: "We create your custom app with only the features you need - nothing more, nothing less. Simple, intuitive, and focused."
  },
  {
    id: 3,
    title: "Maintenance & Support",
    description: "Pay one flat monthly fee for updates, support, and hosting. No per-seat pricing, no hidden costs - just predictable billing."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Your App Opportunity</h2>
          <p className="text-lg text-slate-600">Our streamlined process turns your business needs into powerful, custom solutions.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">{step.id}</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 mb-4">{step.description}</p>
              <div className="h-1 w-16 bg-primary rounded"></div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            size="lg" 
            className="font-medium"
            asChild
          >
            <a href="#contact">Start Your Project</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
