import { useEffect } from "react";

import { Link } from "wouter";

import { motion } from "framer-motion";

import { CheckCircle2, Calendar, Home, Mail, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/nathancwatkins23/web-consulting";
export default function Success() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <CheckCircle2 className="w-24 h-24 text-green-500" strokeWidth={2} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 rounded-full border-4 border-green-500"
              />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-xl text-slate-600">
              Thank you for reaching out. We're excited to work with you!
            </p>
          </motion.div>

          {/* What's Next Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8 border-2 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  What Happens Next?
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        We'll review your message
                      </h3>
                      <p className="text-slate-600">
                        Our team will carefully read through your requirements and prepare a
                        personalized response.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        You'll hear from us within 1 business day
                      </h3>
                      <p className="text-slate-600">
                        We aim to respond within 24 hours with next steps and answers to your
                        questions.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Let's schedule a call</h3>
                      <p className="text-slate-600">
                        We'll discuss your project in detail and create a tailored plan to bring
                        your vision to life.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      A confirmation email has been sent to your inbox
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="gap-2">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5" />
                Schedule a Call Now
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/">
                <Home className="w-5 h-5" />
                Return to Home
              </Link>
            </Button>
          </motion.div>

          {/* Urgency/Scarcity Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-500 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 inline-block">
              <span className="font-semibold text-yellow-700">Pro Tip:</span> Schedule your
              consultation today to lock in current project pricing
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
