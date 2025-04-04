import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pricingFormSchema = z.object({
  screens: z.number().min(1).max(10),
  users: z.number().min(1).max(100),
  authentication: z.boolean().default(false),
  payments: z.boolean().default(false),
  analytics: z.boolean().default(false),
  notifications: z.boolean().default(false),
  roleBasedAccess: z.boolean().default(false),
});

type PricingFormValues = z.infer<typeof pricingFormSchema>;

const BASE_COST = 750;
const PAGE_COST = 100;
const FEATURE_COST = 200;
const AUTH_COST = 1500;
const PAYMENTS_COST = 3000;
const ANALYTICS_COST = 5000;
const NOTIFICATIONS_COST = 2500;
const ROLE_BASED_ACCESS_COST = 1500;
const MONTHLY_MAINTENANCE = 50;
const SAAS_MONTHLY = 100;

// Count number of enabled features for one-time fee calculation
const countEnabledFeatures = (values: any) => 
  Object.entries(values)
    .filter(([key, value]) => 
      ['authentication', 'payments', 'analytics', 'notifications', 'roleBasedAccess'].includes(key) && value
    ).length;

export default function PricingCalculator() {
  const [calculatedOnetime, setCalculatedOnetime] = useState(BASE_COST);
  const [calculatedMonthly, setCalculatedMonthly] = useState(MONTHLY_MAINTENANCE);
  const [estimatedSavings, setEstimatedSavings] = useState(0);
  const [traditionalSaasCost, setTraditionalSaasCost] = useState(SAAS_MONTHLY);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      screens: 5,
      users: 5,
      authentication: false,
      payments: false,
      analytics: false,
      notifications: false,
      roleBasedAccess: false,
    },
  });

  const formValues = form.watch();

  const getPerUserCost = (userCount: number) => {
    const maxCost = 50;  // Cost at 1 user
    const minCost = 10;  // Cost at 100 users
    const scaling = 30;  // Adjusts curve steepness
    return Math.max(minCost, maxCost - Math.log(userCount) * scaling / Math.log(100));
  };

  useEffect(() => {
    const perUserCost = getPerUserCost(formValues.users);
    const baseMonthlyCost = perUserCost * formValues.users;
    const pageMonthlyCost = formValues.screens * 25; // $25 per page per month

    const advancedFeaturesCost =
      (formValues.authentication ? AUTH_COST / 36 : 0) +
      (formValues.payments ? PAYMENTS_COST / 36 : 0) +
      (formValues.analytics ? ANALYTICS_COST / 36 : 0) +
      (formValues.notifications ? NOTIFICATIONS_COST / 36 : 0) +
      (formValues.roleBasedAccess ? ROLE_BASED_ACCESS_COST / 36 : 0);

    const totalMonthlySaasCost = baseMonthlyCost + pageMonthlyCost + advancedFeaturesCost;
    setTraditionalSaasCost(totalMonthlySaasCost);

    const oneTimeCost = Math.round(BASE_COST + (countEnabledFeatures(formValues) * FEATURE_COST));
    setCalculatedOnetime(oneTimeCost);
  }, [formValues]);

  useEffect(() => {
    if (estimatedSavings > 0) {
      const threeYearSaasCost = traditionalSaasCost * 36;
      const threeYearOurCost = calculatedOnetime + (calculatedMonthly * 36);
      const savings = threeYearSaasCost - threeYearOurCost;
      setEstimatedSavings(savings);
    }
  }, [traditionalSaasCost, calculatedOnetime, calculatedMonthly]);

  const calculateSavings = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const threeYearSaasCost = traditionalSaasCost * 36;
      const threeYearOurCost = calculatedOnetime + (calculatedMonthly * 36);
      const savings = threeYearSaasCost - threeYearOurCost;
      setEstimatedSavings(savings);
      setIsCalculating(false);
    }, 500);
  };

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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Save Money with a Tool Made for You</h2>
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
                Cost Savings Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        calculateSavings();
                      }}
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
                                max={10}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium">
                                {field.value === 10 ? "10+" : field.value}
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
                        name="users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Users</FormLabel>
                            <div className="flex items-center gap-4">
                              <Slider
                                min={1}
                                max={100}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium">
                                {field.value === 100 ? "100+" : field.value}
                              </span>
                            </div>
                            <FormDescription>
                              Expected number of users
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-4">Advanced Features</h3>
                        <div className="space-y-4">
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

                          <FormField
                            control={form.control}
                            name="roleBasedAccess"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Role-based Access Control</FormLabel>
                                  <FormDescription>
                                    User permissions and access management
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
                      </div>
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
                        ${Math.round(traditionalSaasCost * 36).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Appturnity Costs (3 Years)
                      </h3>
                      <div className="text-3xl font-bold text-primary">
                        ${(calculatedOnetime + (calculatedMonthly * 36)).toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        ${calculatedOnetime.toLocaleString()} one-time fee + $50/month maintenance
                      </p>
                    </div>

                    {estimatedSavings > 0 && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                        >
                          <h3 className="text-lg font-semibold text-blue-700 mb-2">
                            Monthly Savings
                          </h3>
                          <div className="text-3xl font-bold text-blue-600">
                            ${Math.round(traditionalSaasCost - calculatedMonthly).toLocaleString()}/month
                          </div>
                          <p className="text-sm text-blue-600 mt-1">
                            Save ${Math.round((traditionalSaasCost - calculatedMonthly) * 12).toLocaleString()} per year
                          </p>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="bg-green-50 p-4 rounded-lg border border-green-200"
                        >
                          <h3 className="text-lg font-semibold text-green-700 mb-2">
                            Total Estimated Savings
                          </h3>
                          <motion.div
                            key={formValues.screens}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-bold text-green-600"
                          >
                            ${Math.round(estimatedSavings).toLocaleString()}
                          </motion.div>
                          <p className="text-sm text-green-600 mt-1">
                            Over 3 years compared to traditional SaaS
                          </p>
                        </motion.div>
                      </>
                    )}

                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button 
                        onClick={calculateSavings} 
                        className="w-full"
                        disabled={isCalculating}
                      >
                        {isCalculating ? (
                          <div className="flex items-center gap-2 justify-center">
                            Calculating...
                          </div>
                        ) : (
                          "Calculate Savings"
                        )}
                      </Button>
                    </motion.div>

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

                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 border-t pt-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => {
                    // Save form data to session storage
                    const formData = {
                      screens: formValues.screens,
                      users: formValues.users,
                      features: {
                        authentication: formValues.authentication,
                        payments: formValues.payments,
                        analytics: formValues.analytics,
                        notifications: formValues.notifications,
                        roleBasedAccess: formValues.roleBasedAccess
                      }
                    };
                    
                    // Store as a string in sessionStorage
                    sessionStorage.setItem('pricingFormData', JSON.stringify(formData));
                    
                    // Create message for contact form
                    const featuresList = Object.entries(formData.features)
                      .filter(([_, enabled]) => enabled)
                      .map(([feature]) => feature)
                      .join(', ');
                    
                    const message = `I'm interested in a custom app with ${formData.screens} screens for ${formData.users} users. ${featuresList ? `Features needed: ${featuresList}.` : ''}`;
                    sessionStorage.setItem('contactMessage', message);
                    
                    // Scroll to contact form
                    import('@/lib/utils').then(({ scrollToElement }) => {
                      scrollToElement('contact');
                    });
                  }}
                >
                  Request Detailed Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}