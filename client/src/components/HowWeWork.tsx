import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, MonitorSmartphone, RefreshCcw } from "lucide-react"; // Icons
import { handleSmoothScroll } from "@/lib/utils"; // 👈 Add this import

const steps = [
  {
    id: 1,
    title: "Consultation & Discovery",
    description: "We start with a simple conversation — no jargon, no technical barriers. Just a clear understanding of your goals and how we can showcase your hard work the right way.",
    Icon: MessageSquare
  },
  {
    id: 2,
    title: "Modern Design & Development",
    description: "We craft a landing page tailored to your business — clean, fast, and focused on building trust and driving growth.",
    Icon: MonitorSmartphone
  },
  {
    id: 3,
    title: "Ongoing Support & Updates",
    description: "Stay confident with predictable updates, support, and hosting — no per-seat fees, no hidden costs, just reliable care.",
    Icon: RefreshCcw
  }
];

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">How We Work</h2>
          <p className="text-lg text-slate-600">Our streamlined process turns your business needs into powerful, custom landing page solutions.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <step.Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 mb-4">{step.description}</p>
              <div className="h-1 w-16 bg-primary rounded transition-all duration-300 group-hover:w-32"></div>
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
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, "contact")} // 👈 Smooth scroll added here
            >
              Start Your Project
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
