'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Mail } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';

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

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      // Use fetch directly in Next.js
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 1 business day.",
      });
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

  return (
    <section id="contact" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
          <div className="flex-1">
            <div className="mb-6">
              <div className="inline-flex bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Get Started
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Ready for a Simpler Solution?</h2>
              <p className="text-slate-600 mb-6">Tell us about your needs and we'll schedule a free consultation to see if we're a good fit.</p>
            </div>
            
            <Card className="shadow-lg border border-slate-200">
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
                  
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full flex items-center justify-center gap-2 text-primary hover:text-primary-foreground"
                    onClick={() => window.open('https://calendly.com/stupid-simple-apps', '_blank')}
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule directly via Calendly
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Why Choose Us Column */}
          <div className="flex-1 bg-slate-900 text-white p-8 rounded-lg">
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
                  href="mailto:hello@stupid-simple-apps.com" 
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Mail className="h-4 w-4" />
                  hello@stupid-simple-apps.com
                </a>
                <a 
                  href="https://calendly.com/stupid-simple-apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}