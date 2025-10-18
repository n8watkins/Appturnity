import { z } from 'zod';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Mail, Phone } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/calendly-embed';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/nathancwatkins23/web-consulting';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('240px'); // Increased default height
  const [projectDetails, setProjectDetails] = useState<any>(null); // Store quiz/calculator data
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [, setLocation] = useLocation();
  const formButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // Watch message field to adjust textarea height dynamically
  const messageValue = form.watch('message');
  useEffect(() => {
    if (messageValue) {
      const lineCount = messageValue.split('\n').length;
      // If more than 8 lines, make textarea taller
      if (lineCount > 10) {
        setTextareaHeight('360px');
      } else if (lineCount > 6) {
        setTextareaHeight('300px');
      } else {
        setTextareaHeight('240px'); // Minimum height to match right column
      }
    } else {
      setTextareaHeight('240px'); // Default height
    }
  }, [messageValue]);

  // Listen for calculator changes and update contact form
  useEffect(() => {
    const handleCalculatorUpdate = (event: CustomEvent) => {
      const calculatorData = event.detail;
      setProjectDetails({ source: 'calculator', data: calculatorData });
      formatAndPopulateMessage(calculatorData, 'calculator');
    };

    window.addEventListener('calculatorUpdated', handleCalculatorUpdate as EventListener);

    return () => {
      window.removeEventListener('calculatorUpdated', handleCalculatorUpdate as EventListener);
    };
  }, []);

  async function onSubmit(data: ContactFormValues) {
    if (!executeRecaptcha) {
      toast({
        title: "reCAPTCHA not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Execute reCAPTCHA to get token
      const recaptchaToken = await executeRecaptcha('contact_form');

      // Prepare request data
      const requestData: any = {
        ...data,
        recaptchaToken,
      };

      // Send form data with reCAPTCHA token
      await apiRequest('POST', '/api/contact', requestData);

      form.reset();

      // Redirect to success page
      setLocation('/success');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format and populate contact message from calculator data
  const formatAndPopulateMessage = (data: any, source: 'calculator') => {
    // Format calculator data into a message
    const sections = [];

    if (data.pages) {
      sections.push(`Number of Pages: ${data.pages}`);
    }

    if (data.selectedFeatures && data.selectedFeatures.length > 0) {
      const featureNames = data.selectedFeatures
        .filter((id: string) => {
          // Filter out always-included features for cleaner message
          const alwaysIncluded = ['analytics', 'ssl-hosting', 'responsive', 'basic-seo', 'contact-forms', 'domain-setup'];
          return !alwaysIncluded.includes(id);
        })
        .map((id: string) => {
          // Convert feature IDs to readable names
          const nameMap: Record<string, string> = {
            'seo': 'Advanced SEO',
            'email-templates': 'Email Templates',
            'email-automation': 'Email Automation',
            'newsletter': 'Newsletter Management',
            'forms': 'Custom Forms',
            'cms': 'CMS',
            'blog': 'Blog',
            'multilang': 'Multi-language',
            'auth': 'User Authentication',
            'ecommerce': 'E-commerce',
            'payment': 'Payments',
            'booking': 'Booking',
            'api': 'API Integration',
            'chat': 'Live Chat',
            'crm': 'CRM',
            'cdn': 'CDN',
            'ai': 'Generative AI',
            'animations': 'Animations'
          };
          return nameMap[id] || id;
        });

      if (featureNames.length > 0) {
        sections.push(`Advanced Features:\n${featureNames.map(f => `  • ${f}`).join('\n')}`);
      }
    }

    if (data.totalPrice) {
      sections.push(`Estimated Investment: $${data.totalPrice.toLocaleString()}`);
    }

    if (data.timeline) {
      sections.push(`Timeline: ${data.timeline}`);
    }

    // Check if calculator was prefilled from quiz (has quiz results stored)
    const quizResults = localStorage.getItem('quizResults');
    const discountNote = quizResults ? "\n\n🎉 Quiz Completed: I understand I qualify for a 10% discount on my project!" : "";

    const finalMessage = `I'm interested in discussing a project with the following details:\n\n${sections.join('\n\n')}${discountNote}\n\nLooking forward to hearing from you!`;

    // Set the message in the form
    form.setValue('message', finalMessage);
  };

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-16"
      aria-label="Contact form section"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered heading across the entire screen */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Let's Build Something Great Together
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Ready to get started? Fill out the form below or schedule a free consultation call.
          </p>
        </motion.div>

        {/* Two columns side by side - contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-6xl mx-auto">
          {/* Contact Form Column */}
          <motion.div
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur-xl opacity-30"></div>

              <Card className="relative shadow-2xl border border-slate-700/50 h-full bg-slate-800/90 backdrop-blur-xl">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Get Started Today</h3>
                    <p className="text-slate-400">Fill out the form and we'll get back to you within 24 hours</p>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                      aria-label="Contact form"
                    >
                      <div>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 font-semibold">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/50 h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 font-semibold">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@company.com"
                                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/50 h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 font-semibold">Tell us about your project</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What problem are you trying to solve? What are your goals?"
                                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/50 resize-none"
                                  style={{ minHeight: textareaHeight }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        ref={formButtonRef}
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold text-lg shadow-lg shadow-primary/25 transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </span>
                        ) : (
                          "Send Message →"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Custom reCAPTCHA v3 notification */}
                  <div className="absolute bottom-4 right-4 opacity-70 hover:opacity-100 transition-opacity select-none">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <span>🛡️</span>
                      <span>Protected by reCAPTCHA v3</span>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-700" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase tracking-wider">
                        <span className="bg-slate-800 px-4 text-slate-400 font-medium">or</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <CalendlyButton
                        url={CALENDLY_URL}
                        variant="outline"
                        className="w-full h-14 border-2 border-slate-600 hover:border-primary bg-slate-900/50 hover:bg-slate-900 text-white hover:text-white font-semibold text-base transition-all duration-300"
                        openInNewTab={true}
                        prefill={{
                          name: form.getValues().name || '',
                          email: form.getValues().email || '',
                          customAnswers: {
                            "a1": form.getValues().message || ''
                          }
                        }}
                      >
                        Schedule a Call Instead
                      </CalendlyButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          {/* Why Choose Us Column */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20"></div>

              <div className="relative h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 text-white p-10 rounded-2xl shadow-2xl">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Why Clients Choose Us
                  </h3>
                  <p className="text-slate-400">Here's what sets us apart from the competition</p>
                </div>

                <div className="space-y-6 mb-12">
                  <motion.div
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">Pay Once, Own Forever</h4>
                      <p className="text-slate-400 text-sm">No monthly subscriptions or per-user fees. Your code, your data, your freedom.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">Built for Your Workflow</h4>
                      <p className="text-slate-400 text-sm">Custom solutions designed around your specific needs, not generic templates.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">Rapid Development</h4>
                      <p className="text-slate-400 text-sm">Most projects delivered in 2-8 weeks. Get to market faster than competitors.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">Transparent Pricing</h4>
                      <p className="text-slate-400 text-sm">Know exactly what you're paying upfront. No hidden fees or surprise charges.</p>
                    </div>
                  </motion.div>
                </div>

                <div className="pt-8 border-t border-slate-700/50">
                  <h4 className="text-xl font-semibold mb-6 text-white">Need to talk first?</h4>
                  <div className="space-y-4">
                    <motion.button
                      onClick={() => window.open(CALENDLY_URL, '_blank')}
                      className="flex items-center gap-3 text-blue-300 hover:text-blue-200 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-lg px-4 py-3 w-full transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">Schedule a Free Call</span>
                    </motion.button>

                    <motion.a
                      href="tel:+18182888082"
                      className="flex items-center gap-3 text-emerald-300 hover:text-emerald-200 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-lg px-4 py-3 w-full transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="h-5 w-5" />
                      <span className="font-medium">(818) 288-8082</span>
                    </motion.a>

                    <motion.a
                      href="mailto:nathancwatkins23@gmail.com"
                      className="flex items-center gap-3 text-purple-300 hover:text-purple-200 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-lg px-4 py-3 w-full transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail className="h-5 w-5" />
                      <span className="font-medium">Send an Email</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}
