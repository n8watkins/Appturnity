import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
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

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
          console.log("Loading saved message from session storage:", savedMessage);
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
          console.log("Focus event - loading message:", savedMessage);
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
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', data);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 1 business day.",
      });
      // Clear session storage data after successful submission
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('contactMessage');
        sessionStorage.removeItem('pricingFormData');
      }
      form.reset();
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
        console.log("Manual load of saved message:", savedMessage);
        form.setValue('message', savedMessage);
      }
    }
  };

  return (
    <section 
      id="contact" 
      className="py-20 bg-white scroll-mt-16" 
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
          <p className="text-slate-600 max-w-2xl mx-auto">Tell us about your needs and we'll schedule a free consultation to see if we're a good fit.</p>
        </motion.div>

        {/* Two columns side by side */}
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <a 
                  href="mailto:nathancwatkins23@gmail.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Mail className="h-4 w-4" />
                  nathancwatkins23@gmail.com
                </a>
                <button 
                  onClick={() => window.open('https://calendly.com/nathancwatkins23/web-consulting', '_blank')}
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 bg-transparent border-0 cursor-pointer p-0"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a call
                </button>
                <a 
                  href="tel:+18186001142" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Phone className="h-4 w-4" />
                  (818) 600-1142
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
