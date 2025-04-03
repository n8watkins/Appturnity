import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director, TechStart",
    content: "They delivered exactly what we needed without all the extra fluff. Our team tracker app is intuitive, focused, and costs a fraction of what we were paying for bloated alternatives."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, GreenDelivery",
    content: "The flat monthly fee is refreshing. We can add as many users as we need without worrying about costs exploding. The app is exactly what our delivery business needed."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Office Manager, Corvus Legal",
    content: "Their client intake app transformed our firm. We tried several off-the-shelf solutions but none fit our workflow. Stupid Simple Apps built exactly what we needed - no more, no less."
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-slate-600">Don't just take our word for it. Here's what others have to say about working with us.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="transition-all duration-300"
            >
              <Card className="h-full shadow border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
