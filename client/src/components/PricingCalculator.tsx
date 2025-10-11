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


import {
  BASE_COST,
  PAGE_COST,
  FEATURE_COST,
  AUTH_COST,
  PAYMENTS_COST,
  ANALYTICS_COST,
  NOTIFICATIONS_COST,
  ROLE_BASED_ACCESS_COST,
  MONTHLY_MAINTENANCE,
  SAAS_MONTHLY
} from '../../../data/constants.ts';

const pricingFormSchema = z.object({
  screens: z.number().min(1).max(10),
  users: z.number().min(1).max(20),
});

type PricingFormValues = z.infer<typeof pricingFormSchema>;

export default function PricingCalculator() {
  const [calculatedOnetime, setCalculatedOnetime] = useState(BASE_COST);
  const [calculatedMonthly, setCalculatedMonthly] = useState(MONTHLY_MAINTENANCE);
  const [estimatedSavings, setEstimatedSavings] = useState(0);
  const [traditionalSaasCost, setTraditionalSaasCost] = useState(SAAS_MONTHLY);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      screens: 1,
      users: 5,
    },
  });

  const formValues = form.watch();

  const getPerUserCost = (userCount: number) => {
    const maxCost = 50;  // Cost at 1 user
    const minCost = 15;  // Cost at 20 users
    const scaling = 30;  // Adjusts curve steepness
    return Math.max(minCost, maxCost - Math.log(userCount) * scaling / Math.log(20));
  };

  useEffect(() => {
    const perUserCost = getPerUserCost(formValues.users);
    const baseMonthlyCost = perUserCost * formValues.users;
    const pageMonthlyCost = formValues.screens * 25; // $25 per page per month

    const totalMonthlySaasCost = baseMonthlyCost + pageMonthlyCost;
    setTraditionalSaasCost(totalMonthlySaasCost);

    const oneTimeCost = Math.round(BASE_COST + (formValues.screens * PAGE_COST));
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
                                max={20}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(value) => {
                                  field.onChange(value[0]);
                                }}
                                className="flex-1"
                              />
                              <span className="w-12 text-center font-medium">
                                {field.value === 20 ? "20+" : field.value}
                              </span>
                            </div>
                            <FormDescription>
                              Expected number of users
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>

                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-6">
                    <h4 className="font-semibold text-slate-900 mb-4 text-lg">
                      Everything You Need Included:
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Design & Development</h5>
                        <ul className="space-y-2 text-sm text-slate-600 ml-2">
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Custom design tailored to your brand</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Mobile-responsive across all devices</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Fast loading & optimized performance</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Lead Generation</h5>
                        <ul className="space-y-2 text-sm text-slate-600 ml-2">
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Contact forms & lead capture</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>SEO optimization for search engines</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Analytics integration</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Hosting & Security</h5>
                        <ul className="space-y-2 text-sm text-slate-600 ml-2">
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Reliable hosting (99.9% uptime)</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>SSL security certificate</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Ongoing Support</h5>
                        <ul className="space-y-2 text-sm text-slate-600 ml-2">
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Continuous updates & improvements</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Technical support & bug fixes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                      <p className="text-sm text-slate-500 mt-1">
                        ${Math.round(traditionalSaasCost).toLocaleString()}/month
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Appturnity Costs (3 Years)
                      </h3>
                      <div className="text-3xl font-bold text-primary">
                        ${(calculatedOnetime + (calculatedMonthly * 36)).toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        ${calculatedOnetime.toLocaleString()} one-time fee + ${MONTHLY_MAINTENANCE}/month maintenance
                      </p>
                    </div>

                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <Button
                        onClick={calculateSavings}
                        className="w-full relative overflow-hidden group"
                        disabled={isCalculating}
                      >
                        {isCalculating ? (
                          <div className="flex items-center gap-2 justify-center">
                            Calculating...
                          </div>
                        ) : (
                          <>
                            <span className="relative z-10">Calculate Savings</span>
                            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {estimatedSavings > 0 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
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

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
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
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 border-t pt-8">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      import('@/lib/utils').then(({ scrollToElement }) => {
                        scrollToElement('contact');
                      });
                    }}
                  >
                    Get Started with Quiz
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}