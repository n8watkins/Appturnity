import { motion } from "framer-motion";
import { 
  Building, 
  ShoppingCart, 
  Monitor, 
  Film, 
  MessageSquare, 
  Music 
} from "lucide-react";

// Client logos for social proof section
const clientLogos = [
  { id: 1, name: "Airbnb", Icon: Building },
  { id: 2, name: "Amazon", Icon: ShoppingCart },
  { id: 3, name: "Microsoft", Icon: Monitor },
  { id: 4, name: "Netflix", Icon: Film },
  { id: 5, name: "Slack", Icon: MessageSquare },
  { id: 6, name: "Spotify", Icon: Music },
];

export default function SocialProof() {
  return (
    <section className="py-12 bg-white border-t border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-lg text-center text-slate-500 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Trusted by forward-thinking companies
        </motion.h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {clientLogos.map((logo, index) => (
            <motion.div 
              key={logo.id}
              className="grayscale hover:grayscale-0 transition-all h-12 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <logo.Icon className="text-3xl text-slate-700" />
                <span className="text-xs text-slate-500">{logo.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
