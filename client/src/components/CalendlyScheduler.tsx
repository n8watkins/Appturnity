import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar } from "lucide-react";

import { CalendlyEmbed } from "@/components/ui/calendly-embed";

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/nathancwatkins23/web-consulting";
export default function CalendlyScheduler() {
  return (
    <section id="schedule" className="py-20 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Schedule a Consultation
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Book a free 30-minute call to discuss your project needs and how we can help you build a
            stupid simple app that solves your exact problem.
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
                Choose a Time for Your Free Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Directly embed Calendly scheduler */}
              <CalendlyEmbed
                url={CALENDLY_URL}
                utm={{
                  utmSource: "website",
                  utmMedium: "scheduler_page",
                }}
              />
            </CardContent>
          </Card>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">What to Expect</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="text-primary">✓</div>
                <div>A personalized assessment of your app needs</div>
              </li>
              <li className="flex gap-3">
                <div className="text-primary">✓</div>
                <div>Clear pricing information with no hidden fees</div>
              </li>
              <li className="flex gap-3">
                <div className="text-primary">✓</div>
                <div>Recommendations on the best approach for your project</div>
              </li>
              <li className="flex gap-3">
                <div className="text-primary">✓</div>
                <div>Answers to any questions about our process</div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
