import { Star, Package, PackagePlus } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: <Star className="text-primary" />,
    title: "Simplicity First",
    description: "We believe simple solutions work better. No bloated features, just focused apps that solve specific problems."
  },
  {
    id: 2,
    icon: <Package className="text-primary" />,
    title: "Fair Pricing",
    description: "No per-seat pricing that punishes growth. We charge a predictable flat fee so your costs don't spiral as you scale."
  },
  {
    id: 3,
    icon: <PackagePlus className="text-primary" />,
    title: "Ongoing Partnership",
    description: "We don't just build and disappear. We maintain your app, keep it running smoothly, and help it evolve with your needs."
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-100 p-1 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Our team at work" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Why We're Different</h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.id} 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
