import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const pricingFormSchema = z.object({
  screens: z.number().min(1).max(20),
  users: z.number().min(1).max(1000),
  features: z.number().min(1).max(50),
  authentication: z.boolean().default(false),
  payments: z.boolean().default(false),
  analytics: z.boolean().default(false),
  notifications: z.boolean().default(false)
});

type PricingFormValues = z.infer<typeof pricingFormSchema>;

const PAGE_COST = 750;
const BASE_COST = 750;
const FEATURE_COST = 800;
const AUTH_COST = 2000;
const PAYMENTS_COST = 3000;
const ANALYTICS_COST = 1500;
const NOTIFICATIONS_COST = 1000;
const MONTHLY_MAINTENANCE = 50; // Fixed monthly maintenance fee
const SAAS_MONTHLY = 150; // Traditional SaaS monthly fee

export default function PricingCalculator() {
  const [expanded, setExpanded] = useState(false);
  const [calculatedOnetime, setCalculatedOnetime] = useState(0);
  const [calculatedMonthly, setCalculatedMonthly] = useState(0);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      screens: 5,
      users: 10,
      features: 5,
      authentication: false,
      payments: false,
      analytics: false,
      notifications: false
    },
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePrice = useCallback((data: PricingFormValues) => {
    setIsCalculating(true);
    // Simulate calculation time
    setTimeout(() => {
      let oneTimePrice = BASE_COST; // Flat fee of $750
      setCalculatedOnetime(oneTimePrice);
      setCalculatedMonthly(MONTHLY_MAINTENANCE);
      setIsCalculating(false);
    }, 500);
  }, []);

  // Recalculate price whenever form values change
  const formValues = form.watch();
  useEffect(() => {
    calculatePrice(formValues);
  }, [calculatePrice, formValues]);

  return (
    <section id="pricing" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Cost Savings Calculator</h2>
          <p className="text-lg text-slate-600">
            See how much you can save compared to traditional SaaS solutions with our custom development approach.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-lg border border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Price Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="screens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Pages</FormLabel>
                            <div className="flex items-center gap-4">
                              <Slider
                                min={1}
                                max={20}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium">
                                {field.value}
                              </span>
                            </div>
                            <FormDescription>
                              Each unique page in your app
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Features</FormLabel>
                            <div className="flex items-center gap-4">
                              <Slider
                                min={1}
                                max={50}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium">
                                {field.value}
                              </span>
                            </div>
                            <FormDescription>
                              Core functionality and components
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Monthly Users</FormLabel>
                            <div className="flex items-center gap-4">
                              <Slider
                                min={1}
                                max={1000}
                                step={10}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <Input
                                type="number"
                                className="w-20"
                                value={field.value}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1 && value <= 1000) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={expanded ? "advanced" : ""}
                        onValueChange={(value) => setExpanded(value === "advanced")}
                      >
                        <AccordionItem value="advanced">
                          <AccordionTrigger className="text-primary">
                            Advanced Features
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <FormField
                                control={form.control}
                                name="authentication"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>User Authentication</FormLabel>
                                      <FormDescription>
                                        Login, registration and user profiles
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="payments"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Payment Processing</FormLabel>
                                      <FormDescription>
                                        Stripe or other payment gateway integration
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="analytics"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Analytics Dashboard</FormLabel>
                                      <FormDescription>
                                        User insights and usage tracking
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="notifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Push Notifications</FormLabel>
                                      <FormDescription>
                                        Email and in-app notification system
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button type="submit" className="w-full">
                        Calculate Estimate
                      </Button>
                    </form>
                  </Form>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Traditional SaaS Cost (3 Years)
                      </h3>
                      <div className="text-4xl font-bold text-slate-600">
                        ${(SAAS_MONTHLY * 36).toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        $150/month typical SaaS cost
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Your Total Cost (3 Years)
                      </h3>
                      <div className="text-3xl font-bold text-primary">
                        ${(calculatedOnetime + (MONTHLY_MAINTENANCE * 36)).toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        One-time fee + $50/month maintenance
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">
                        Monthly Savings
                      </h3>
                      <div className="text-3xl font-bold text-blue-600">
                        ${(SAAS_MONTHLY - MONTHLY_MAINTENANCE).toLocaleString()}/month
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        Save ${((SAAS_MONTHLY - MONTHLY_MAINTENANCE) * 12).toLocaleString()} per year
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 relative">
                      {isCalculating && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-green-700 mb-2">
                        Your Estimated Savings
                      </h3>
                      <motion.div 
                        key={formValues.screens} 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-bold text-green-600"
                      >
                        ${((SAAS_MONTHLY * formValues.screens * 36) - (calculatedOnetime + (calculatedMonthly * 36))).toLocaleString()}
                      </motion.div>
                      <p className="text-sm text-green-600 mt-1">
                        Over 3 years compared to traditional SaaS
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-2">
                        What's included:
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Custom design and development</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Unlimited users with no per-seat pricing</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Continuous updates and improvements</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Technical support and bug fixes</span>
                        </li>
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full" asChild>
                      <a href="#contact">Request Detailed Quote</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}