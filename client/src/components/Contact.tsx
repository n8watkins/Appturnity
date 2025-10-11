import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Mail, Phone } from 'lucide-react';
import { CalendlyButton } from '@/components/ui/calendly-embed';
import ServiceQuiz from '@/components/ServiceQuiz';

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

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
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

  // Effect to load saved data from sessionStorage
  useEffect(() => {
    // We need to make sure we're running in the browser environment
    if (typeof window !== 'undefined') {
      try {
        // Get any previously stored contact message
        const savedMessage = sessionStorage.getItem('contactMessage');
        
        if (savedMessage) {
          form.setValue('message', savedMessage);
        }
      } catch (e) {
        // Fail silently if sessionStorage is not available
        console.error("Error accessing sessionStorage:", e);
      }
    }
    
    // Setup a focus event listener to reload data when coming back to this section
    const handleFocus = () => {
      if (typeof window !== 'undefined') {
        const savedMessage = sessionStorage.getItem('contactMessage');
        if (savedMessage) {
          form.setValue('message', savedMessage);
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('scroll', handleFocus, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('scroll', handleFocus);
    };
  }, [form]);

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

      // Send form data with reCAPTCHA token
      await apiRequest('POST', '/api/contact', {
        ...data,
        recaptchaToken,
      });

      // Clear session storage data after successful submission
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('contactMessage');
        sessionStorage.removeItem('pricingFormData');
      }
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

  // Function to load message data from session storage - can be called directly
  const loadSessionData = () => {
    if (typeof window !== 'undefined') {
      const savedMessage = sessionStorage.getItem('contactMessage');
      if (savedMessage) {
        form.setValue('message', savedMessage);
      }
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (results: Record<string, string>) => {
    // Format quiz results into a message
    const labelMap: Record<string, string> = {
      projectType: "Project Type",
      primaryGoal: "Primary Goal",
      features: "Features Needed",
      timeline: "Timeline",
      budget: "Budget Range",
    };

    const valueMap: Record<string, Record<string, string>> = {
      projectType: {
        "landing-page": "Landing Page",
        "business-website": "Business Website",
        "web-app": "Web Application",
        "ecommerce": "E-commerce Store",
        "not-sure": "Not Sure Yet",
      },
      primaryGoal: {
        "generate-leads": "Generate More Leads",
        "sell-products": "Sell Products/Services",
        "build-brand": "Build Brand Awareness",
        "automate-process": "Automate Business Processes",
        "replace-saas": "Replace Expensive SaaS",
      },
      features: {
        "contact-forms": "Contact Forms",
        "booking-scheduling": "Booking/Scheduling System",
        "payment-integration": "Payment Integration",
        "user-accounts": "User Account System",
        "integrations": "Third-party Integrations",
        "custom-tools": "Custom Tools/Calculators",
      },
      timeline: {
        "asap": "As Soon As Possible",
        "1-2-months": "1-2 Months",
        "3-6-months": "3-6 Months",
        "flexible": "Flexible Timeline",
      },
      budget: {
        "under-5k": "Under $5,000",
        "5k-10k": "$5,000 - $10,000",
        "10k-25k": "$10,000 - $25,000",
        "25k-plus": "$25,000+",
        "not-sure": "Need Budget Guidance",
      },
    };

    const formattedMessage = Object.entries(results)
      .map(([key, value]) => {
        const label = labelMap[key] || key;
        const displayValue = valueMap[key]?.[value] || value;
        return `${label}: ${displayValue}`;
      })
      .join("\n");

    const finalMessage = `I'm interested in discussing a project with the following details:\n\n${formattedMessage}\n\nLooking forward to hearing from you!`;

    // Set the message in the form
    form.setValue('message', finalMessage);
    setQuizCompleted(true);

    // Smooth scroll to the form button with a delay
    setTimeout(() => {
      formButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 500);
  };

  return (
    <section
      id="contact"
      className="py-20 bg-white scroll-mt-16"
      aria-label="Contact form section"
      onFocus={loadSessionData}
      onClick={loadSessionData}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered heading across the entire screen */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onViewportEnter={loadSessionData}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Ready for a Simpler Solution?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {!quizCompleted
              ? "Take our quick 2-minute quiz to help us understand your needs better"
              : "Great! Now tell us a bit more about yourself and we'll be in touch"}
          </p>
        </motion.div>

        {/* Service Quiz - shown first */}
        {!quizCompleted && (
          <motion.div
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ServiceQuiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {/* Two columns side by side - shown after quiz */}
        {quizCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
          {/* Contact Form Column */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border border-slate-200 h-full">
              <CardContent className="p-6 md:p-8">
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@company.com" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
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
                            <FormLabel>Tell us about your app needs</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What problem are you trying to solve?" 
                                className="min-h-[120px]" 
                                onFocus={loadSessionData}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      ref={formButtonRef}
                      type="submit"
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Schedule Free Consultation"}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">or</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <CalendlyButton
                      url="https://calendly.com/nathancwatkins23/web-consulting"
                      variant="outline"
                      className="w-full"
                      openInNewTab={true}
                      prefill={{
                        name: form.getValues().name || '',
                        email: form.getValues().email || '',
                        customAnswers: {
                          "a1": form.getValues().message || ''
                        }
                      }}
                    >
                      Schedule a call with Calendly
                    </CalendlyButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Why Choose Us Column */}
          <motion.div
            className="flex-1 bg-slate-900 text-white p-8 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-8">Why Clients Choose Us</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="text-orange-400 mt-1">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Custom apps designed around your specific workflow</h4>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-orange-400 mt-1">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Flat monthly fee with no per-user pricing</h4>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-orange-400 mt-1">✓</div>
                <div>
                  <h4 className="font-semibold text-white">No bloated features you'll never use</h4>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-orange-400 mt-1">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Ongoing support and updates included</h4>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-6 border-t border-slate-700">
              <h4 className="text-xl font-medium mb-4">Have questions?</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('https://calendly.com/nathancwatkins23/web-consulting', '_blank')}
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 bg-transparent border-0 cursor-pointer p-0"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a call
                </button>
                <a
                  href="tel:+18182888082"
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Phone className="h-4 w-4" />
                  (818) 288-8082
                </a>
                <a 
                  href="mailto:nathancwatkins23@gmail.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Mail className="h-4 w-4" />
                  nathancwatkins23@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
