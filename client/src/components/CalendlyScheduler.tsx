import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/calendly-embed';

export default function CalendlyScheduler() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <section id="schedule" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Schedule a Consultation
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Book a free 30-minute call to discuss your project needs and how we can help you build a stupid simple app that solves your exact problem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-lg border border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Book Your Free Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-slate-600 mb-8">
                Click the button below to open our Calendly scheduling page and choose a time that works for you.
              </p>
              
              <div className="max-w-sm mx-auto">
                <CalendlyButton
                  url="https://calendly.com/stupid-simple-apps/30min"
                  className="w-full py-6 text-lg"
                  prefill={{
                    name: name,
                    email: email
                  }}
                  utm={{
                    utmSource: "website",
                    utmMedium: "scheduling_page"
                  }}
                >
                  Schedule Your Free Consultation
                </CalendlyButton>
              </div>
              
              <div className="mt-8 text-sm text-slate-500">
                <p>By scheduling a consultation, you'll get:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-left max-w-md mx-auto">
                  <li>A personalized assessment of your app needs</li>
                  <li>Clear pricing information with no hidden fees</li>
                  <li>Recommendations on the best approach for your project</li>
                  <li>Answers to any questions about our process</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}