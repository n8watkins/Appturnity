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
import ServiceQuiz from '@/components/ServiceQuiz';
import RecommendationCard from '@/components/RecommendationCard';
import { getRecommendation, getPriorityLabel, type Recommendation } from '@/lib/quizRecommendations';

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
  const [textareaHeight, setTextareaHeight] = useState('120px');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [quizKey, setQuizKey] = useState(0); // Key to force quiz remount
  const [autoStartQuiz, setAutoStartQuiz] = useState(false);
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [, setLocation] = useLocation();
  const formButtonRef = useRef<HTMLButtonElement>(null);

  // Listen for custom quiz start event
  useEffect(() => {
    const handleStartQuiz = () => {
      setAutoStartQuiz(true);
      setQuizKey(prev => prev + 1);
    };

    window.addEventListener('startQuiz', handleStartQuiz);

    return () => {
      window.removeEventListener('startQuiz', handleStartQuiz);
    };
  }, []);

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
      if (lineCount > 8) {
        setTextareaHeight('300px');
      } else if (lineCount > 5) {
        setTextareaHeight('200px');
      } else {
        setTextareaHeight('120px');
      }
    }
  }, [messageValue]);

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

      // Prepare request data with recommendation if available
      const requestData: any = {
        ...data,
        recaptchaToken,
      };

      // Add recommendation data if quiz was completed
      if (recommendation) {
        requestData.recommendation = {
          solutionName: recommendation.solutionName,
          solutionType: recommendation.solutionType,
          timeline: recommendation.timeline,
          investmentRange: recommendation.investmentRange,
          priorityScore: recommendation.priorityScore,
          priorityLabel: getPriorityLabel(recommendation.priorityScore),
          scores: recommendation.scores,
        };
      }

      // Send form data with reCAPTCHA token and recommendation
      await apiRequest('POST', '/api/contact', requestData);

      form.reset();
      setRecommendation(null);

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

  // Handle quiz completion
  const handleQuizComplete = (results: Record<string, string | string[]>) => {
    // Generate recommendation
    const rec = getRecommendation(results);
    setRecommendation(rec);

    // Format quiz results into a message
    const labelMap: Record<string, string> = {
      currentSituation: "Current Situation",
      industry: "Industry",
      businessGoal: "Business Goals",
      targetAudience: "Target Audience",
      features: "Desired Features",
      projectScope: "Solution Type",
      existingAssets: "Brand Materials",
      timeline: "Launch Timeline",
      investment: "Investment Budget",
      companySize: "Company Size",
      decisionMaker: "Decision Authority",
    };

    const valueMap: Record<string, Record<string, string>> = {
      currentSituation: {
        "no-website": "No Website Yet",
        "outdated-website": "Outdated Website",
        "losing-leads": "Losing Leads",
        "paying-too-much": "Paying Too Much for SaaS",
        "manual-processes": "Too Many Manual Processes",
      },
      industry: {
        "professional-services": "Professional Services",
        "healthcare": "Healthcare",
        "home-services": "Home Services",
        "retail-ecommerce": "Retail/E-commerce",
        "real-estate": "Real Estate",
        "technology": "Technology/SaaS",
        "hospitality": "Hospitality",
        "other": "Other",
      },
      businessGoal: {
        "more-customers": "Get More Customers",
        "save-time": "Save Time",
        "reduce-costs": "Reduce Costs",
        "improve-credibility": "Look More Professional",
        "scale-business": "Scale My Business",
      },
      targetAudience: {
        "b2b": "Businesses (B2B)",
        "b2c": "Consumers (B2C)",
        "both": "Both B2B and B2C",
        "internal": "Internal Team",
      },
      features: {
        "contact-forms": "Contact Forms",
        "booking-scheduling": "Booking/Scheduling",
        "payment-processing": "Payment Processing",
        "user-accounts": "User Accounts/Login",
        "cms": "Content Management",
        "analytics": "Analytics Dashboard",
        "integrations": "Third-party Integrations",
        "none": "None / Basic Website",
      },
      projectScope: {
        "simple-landing": "Simple Landing Page",
        "full-website": "Complete Website",
        "custom-app": "Custom Web Application",
        "ecommerce-store": "E-commerce Store",
        "not-sure": "Not Sure Yet",
      },
      existingAssets: {
        "full-brand": "Yes, Full Branding",
        "partial-brand": "Some Materials",
        "no-brand": "No, Need Help",
      },
      timeline: {
        "urgent": "Within 4-6 Weeks",
        "normal": "6-10 Weeks",
        "planning": "10-16 Weeks",
        "flexible": "16+ Weeks",
      },
      investment: {
        "budget-conscious": "Under $3,000",
        "standard": "$3,000 - $7,000",
        "premium": "$7,000 - $15,000",
        "enterprise": "$15,000+",
        "premium-budget": "Premium/No Limit",
        "need-guidance": "Need Guidance",
      },
      companySize: {
        "solo": "Just Me",
        "2-10": "2-10 Employees",
        "11-50": "11-50 Employees",
        "51-200": "51-200 Employees",
        "200+": "200+ Employees",
      },
      decisionMaker: {
        "owner": "Owner/Founder",
        "executive": "Executive/C-Level",
        "manager": "Manager",
        "team-member": "Team Member",
      },
    };

    const formattedSections = Object.entries(results)
      .map(([key, value]) => {
        const label = labelMap[key] || key;
        if (Array.isArray(value)) {
          const displayValues = value
            .map(v => `  • ${valueMap[key]?.[v] || v}`)
            .join("\n");
          return `${label}:\n${displayValues}`;
        } else {
          const displayValue = valueMap[key]?.[value] || value;
          return `${label}:\n  • ${displayValue}`;
        }
      })
      .join("\n\n");

    const finalMessage = `I'm interested in discussing a project with the following details:\n\n${formattedSections}\n\nLooking forward to hearing from you!`;

    // Set the message in the form
    form.setValue('message', finalMessage);

    // Smooth scroll to the form button with a delay
    setTimeout(() => {
      formButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 500);
  };

  // Handle quiz retake
  const handleRetakeQuiz = () => {
    setRecommendation(null);
    form.setValue('message', '');
    setQuizKey(prev => prev + 1); // Force quiz to remount and reset
    // Scroll to quiz
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="contact"
      className="py-20 bg-white scroll-mt-16"
      aria-label="Contact form section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered heading across the entire screen */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Ready for a Simpler Solution?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Take our quick 60-second quiz to get instant pricing and a custom solution roadmap, or fill out the form directly
          </p>
        </motion.div>

        {/* Service Quiz */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ServiceQuiz key={quizKey} onComplete={handleQuizComplete} autoStart={autoStartQuiz} />
        </motion.div>

        {/* Recommendation Card */}
        {recommendation && (
          <motion.div
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <RecommendationCard
              recommendation={recommendation}
              onContinue={() => {
                formButtonRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
              onRetake={handleRetakeQuiz}
            />
          </motion.div>
        )}

        {/* Two columns side by side - contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
                                style={{ minHeight: textareaHeight }}
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
      </div>
    </section>
  );
}
