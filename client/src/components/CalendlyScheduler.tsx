import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function CalendlyScheduler() {
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Initialize Calendly widget when the container is ready
    if (calendlyContainerRef.current) {
      // Reset any previous Calendly widgets
      calendlyContainerRef.current.innerHTML = '';

      // Create inline widget div
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'calendly-inline-widget';
      widgetDiv.style.minWidth = '320px';
      widgetDiv.style.height = '630px';
      widgetDiv.setAttribute('data-url', 'https://calendly.com/appturnity/30min');
      
      calendlyContainerRef.current.appendChild(widgetDiv);

      // Force Calendly to re-initialize (if their global object exists)
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/appturnity/30min',
          parentElement: widgetDiv,
          prefill: {},
          utm: {}
        });
      }
    }
  }, [calendlyContainerRef]);

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
          <p className="text-lg text-slate-600">
            Book a free 30-minute call to discuss your project needs and how we can help
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-lg border border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Choose a Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={calendlyContainerRef} className="calendly-container" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// Add this to make TypeScript happy with the Calendly global object
declare global {
  interface Window {
    Calendly?: any;
  }
}