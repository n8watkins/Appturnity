import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Palette,
  TrendingUp,
  Shield,
  Target,
  Search,
  Plus,
  Minus,
  CreditCard,
  Calendar,
  Mail,
  Users,
  Upload,
  Zap,
  BarChart,
  Eye,
  TestTube2,
  MessageSquare,
  Bot,
  Smartphone,
  Gauge,
  Sparkles,
  Moon,
  Image,
  FileText,
  Lock,
  Server,
  Database,
  UserCheck,
  LifeBuoy,
  BookOpen,
  RefreshCw,
  Headphones,
  Settings,
  Send,
  ShoppingCart,
  Globe,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatWidget = lazy(() => import("@/components/ChatWidget"));

const categories = [
  {
    id: "design",
    name: "Design & Brand",
    icon: Palette,
  },
  {
    id: "marketing",
    name: "Lead Generation",
    icon: TrendingUp,
  },
  {
    id: "security",
    name: "Security & Hosting",
    icon: Shield,
  },
];

const allFeatures = [
  // Design & Brand Identity
  {
    category: "design",
    name: "Custom Design",
    details: "Colors, fonts, and style perfectly aligned with your business identity",
    type: "essential",
    icon: Palette,
  },
  {
    category: "design",
    name: "Mobile Responsive",
    details: "Automatically adapts to phones, tablets, and desktops",
    type: "essential",
    icon: Smartphone,
  },
  {
    category: "design",
    name: "Modern Animations",
    details: "Subtle transitions and effects that guide users naturally",
    type: "essential",
    icon: Sparkles,
  },
  {
    category: "design",
    name: "Professional Typography",
    details: "Carefully selected fonts that enhance readability and brand",
    type: "essential",
    icon: FileText,
  },
  {
    category: "design",
    name: "Performance Optimized",
    details: "Lightning-fast load times under 2 seconds with optimized images",
    type: "essential",
    icon: Zap,
  },
  {
    category: "design",
    name: "Dark Mode",
    details: "Toggle between light and dark themes for user comfort",
    type: "advanced",
    icon: Moon,
  },
  {
    category: "design",
    name: "Advanced Animations",
    details: "Complex scroll-triggered animations and interactive elements",
    type: "advanced",
    icon: Sparkles,
  },
  {
    category: "design",
    name: "Custom Illustrations",
    details: "Original icons and visuals designed specifically for your brand",
    type: "advanced",
    icon: Image,
  },
  {
    category: "design",
    name: "Micro-interactions",
    details: "Delightful button effects and hover animations throughout",
    type: "advanced",
    icon: Zap,
  },

  // Lead Generation & Marketing
  {
    category: "marketing",
    name: "Contact Forms",
    details: "Spam-protected forms that email you instantly when submitted",
    type: "essential",
    icon: Mail,
  },
  {
    category: "marketing",
    name: "SEO Optimization",
    details: "Meta tags, sitemaps, and structure to rank in search results",
    type: "essential",
    icon: Search,
  },
  {
    category: "marketing",
    name: "Google Analytics",
    details: "See who visits, what they do, and where they come from",
    type: "essential",
    icon: BarChart,
  },
  {
    category: "marketing",
    name: "Social Media Links",
    details: "Connect your social profiles with branded icons",
    type: "essential",
    icon: Users,
  },
  {
    category: "security",
    name: "Custom Domain Setup",
    details: "Connect your own domain name with full DNS configuration",
    type: "essential",
    icon: Globe,
  },
  {
    category: "marketing",
    name: "Email Templates",
    details: "Custom branded email designs for notifications and campaigns",
    type: "advanced",
    icon: Mail,
  },
  {
    category: "marketing",
    name: "Email Automation",
    details: "Automated email sequences and drip campaigns",
    type: "advanced",
    icon: Send,
  },
  {
    category: "marketing",
    name: "Newsletter Management",
    details: "Email list building and subscriber management",
    type: "advanced",
    icon: Mail,
  },
  {
    category: "marketing",
    name: "Blog Integration",
    details: "Built-in content management system for articles and updates",
    type: "advanced",
    icon: FileText,
  },
  {
    category: "marketing",
    name: "Advanced SEO",
    details: "Schema markup, rich snippets, and ongoing SEO improvements",
    type: "advanced",
    icon: TrendingUp,
  },
  {
    category: "marketing",
    name: "Conversion Tracking",
    details: "Track form submissions, purchases, and other key actions",
    type: "advanced",
    icon: Target,
  },
  {
    category: "marketing",
    name: "Multi-step Forms",
    details: "Progressive forms that increase completion rates",
    type: "advanced",
    icon: FileText,
  },
  {
    category: "marketing",
    name: "Email Marketing",
    details: "Auto-add signups to your email list with Mailchimp integration",
    type: "advanced",
    icon: Send,
  },
  {
    category: "marketing",
    name: "CRM Integration",
    details: "Sync with Salesforce, HubSpot, or other platforms",
    type: "advanced",
    icon: Settings,
  },

  // Security & Hosting
  {
    category: "security",
    name: "SSL Certificate",
    details: "Encrypted HTTPS connection protects your visitors' data",
    type: "essential",
    icon: Lock,
  },
  {
    category: "security",
    name: "Cloud Hosting",
    details: "Fast, reliable hosting with 99.9% uptime on premium servers",
    type: "essential",
    icon: Server,
  },
  {
    category: "security",
    name: "Regular Updates",
    details: "Security patches and framework updates to keep your site safe",
    type: "essential",
    icon: RefreshCw,
  },
  {
    category: "security",
    name: "User Authentication",
    details: "Let customers create accounts with secure password protection",
    type: "advanced",
    icon: UserCheck,
  },
  {
    category: "security",
    name: "Payment Processing",
    details: "Stripe integration for secure online credit card payments",
    type: "advanced",
    icon: CreditCard,
  },
  {
    category: "security",
    name: "File Uploads",
    details: "Let users upload documents safely to secure cloud storage",
    type: "advanced",
    icon: Upload,
  },
  {
    category: "security",
    name: "API Integration",
    details: "Connect to third-party services with secure API endpoints",
    type: "advanced",
    icon: Zap,
  },
  {
    category: "security",
    name: "E-commerce Platform",
    details: "Full online store with product catalog, cart, and checkout",
    type: "advanced",
    icon: ShoppingCart,
  },
  {
    category: "security",
    name: "Multi-language Support",
    details: "Reach global audiences with multiple language options",
    type: "advanced",
    icon: Globe,
  },
  {
    category: "security",
    name: "Custom Integrations",
    details: "Connect to your existing tools and business systems",
    type: "advanced",
    icon: Settings,
  },
  {
    category: "security",
    name: "Dedicated Support",
    details: "Priority support with faster response times",
    type: "advanced",
    icon: Headphones,
  },
  {
    category: "security",
    name: "White-glove Service",
    details: "Personalized service with dedicated account management",
    type: "advanced",
    icon: Star,
  },
];

const faqs = [
  {
    question: "What's included in every project?",
    answer:
      "All essential features are included at no extra cost - things like responsive design, SSL, hosting, contact forms, basic SEO, and analytics. You get a complete, professional website ready to drive results.",
  },
  {
    question: "How do advanced features work?",
    answer:
      "Advanced features are optional add-ons you can choose based on your business needs. Want user accounts? Payment processing? Calendar booking? Just let us know and we'll include them in your quote.",
  },
  {
    question: "Can I add features after launch?",
    answer:
      "Absolutely! We build sites to be expandable. Start with the essentials and add features like payments, integrations, or automation later as your business grows.",
  },
  {
    question: "Do these features cost extra per month?",
    answer:
      "Most features are one-time costs with no ongoing fees. Some integrations (like Stripe for payments) have their own fees, but we'll discuss those upfront so there are no surprises.",
  },
  {
    question: "How do I know which features I need?",
    answer:
      "Take our quick quiz or schedule a free consultation. We'll review your business goals and recommend the right features - no overselling, just what makes sense for you.",
  },
];

export default function Features() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuizClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to home page
    setLocation("/");
    // Wait for navigation and page load, then trigger quiz and scroll
    setTimeout(() => {
      // Dispatch the event to open the quiz
      window.dispatchEvent(new Event("startQuiz"));
      // Wait a bit more for the quiz to be ready, then scroll
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }, 500);
  };

  // Filter features based on category and search
  const filteredFeatures = allFeatures.filter((feature) => {
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory;
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separate essential and advanced features
  const essentialFeatures = filteredFeatures.filter((f) => f.type === "essential");
  const advancedFeatures = filteredFeatures.filter((f) => f.type === "advanced");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 pb-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              asChild
              variant="ghost"
              className="mb-8 text-white hover:text-white hover:bg-white/10"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything You'll{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                Get
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hover over any feature to see what it does and how it helps your business
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-md mx-auto relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20"
              />
            </motion.div>

            {/* Category Pills */}
            <motion.div
              className="flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={
                  selectedCategory === "all"
                    ? "whitespace-nowrap"
                    : "whitespace-nowrap text-white hover:text-white hover:bg-white/10 border border-white/20"
                }
              >
                All Features
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "whitespace-nowrap"
                        : "whitespace-nowrap text-white hover:text-white hover:bg-white/10 border border-white/20"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-[1400px]">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No features found matching your search.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Essential Features Column */}
              {essentialFeatures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3">
                      <p className="text-white font-semibold text-sm uppercase tracking-wide">
                        Essential
                      </p>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      Included in Every Project
                    </h2>
                    <p className="text-slate-600 text-lg">Everything you need to get started</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {essentialFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={`${feature.category}-${feature.name}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 + index * 0.02 }}
                          className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-green-300 transition-all duration-300 flex flex-col items-center min-h-[150px] justify-center"
                        >
                          {/* Card content that shrinks and moves up */}
                          <div className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-90 group-hover:-translate-y-1">
                            {Icon && <Icon className="h-6 w-6 text-green-600 flex-shrink-0" />}
                            <h3 className="font-semibold text-base text-slate-900 text-center">
                              {feature.name}
                            </h3>
                          </div>

                          {/* Details that fade in on hover */}
                          <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 text-center mt-0 group-hover:mt-1">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {feature.details}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Advanced Features Column */}
              {advancedFeatures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8 text-center lg:text-left">
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-3">
                      <p className="text-white font-semibold text-sm uppercase tracking-wide">
                        Advanced
                      </p>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Level Up Your Site</h2>
                    <p className="text-slate-600 text-lg">Pick the features that fit your goals</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {advancedFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={`${feature.category}-${feature.name}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 + index * 0.02 }}
                          className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 transition-all duration-300 flex flex-col items-center min-h-[150px] justify-center"
                        >
                          {/* Card content that shrinks and moves up */}
                          <div className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-90 group-hover:-translate-y-1">
                            {Icon && <Icon className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                            <h3 className="font-semibold text-base text-slate-900 text-center">
                              {feature.name}
                            </h3>
                          </div>

                          {/* Details that fade in on hover */}
                          <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 text-center mt-0 group-hover:mt-1">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {feature.details}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.h2
            className="text-3xl font-bold text-slate-900 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Common Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <Minus className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss which features are right for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" asChild>
                <Link href="/#contact">Get Your Free Quote</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8"
                onClick={handleQuizClick}
              >
                Take the Quiz
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}
