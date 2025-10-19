/**
 * Service Quiz Questions Data
 *
 * All quiz questions and their options centralized for easy maintenance
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
  multiSelect?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "pageCount",
    question: "How many pages will your website need?",
    options: [
      { value: "1-5", label: "1-5 Pages", description: "Simple site or landing page" },
      { value: "6-12", label: "6-12 Pages", description: "Professional business site" },
      { value: "13-20", label: "13-20 Pages", description: "Comprehensive website" },
      { value: "20+", label: "20+ Pages", description: "Large-scale solution" },
      { value: "not-sure", label: "Not Sure", description: "Help me decide" },
    ],
  },
  {
    id: "teamSize",
    question: "How many users will need access to manage or use the system?",
    options: [
      { value: "1-3", label: "1-3 Users", description: "Just me or small team" },
      { value: "4-7", label: "4-7 Users", description: "Small to medium team" },
      { value: "8-15", label: "8-15 Users", description: "Medium team" },
      { value: "15+", label: "15+ Users", description: "Large team or organization" },
    ],
  },
  {
    id: "currentSituation",
    question: "What's your current situation?",
    options: [
      { value: "no-website", label: "No Website Yet", description: "Starting from scratch" },
      {
        value: "outdated-website",
        label: "Outdated Website",
        description: "Need a modern redesign",
      },
      {
        value: "losing-leads",
        label: "Losing Leads",
        description: "Website isn't converting visitors",
      },
      {
        value: "paying-too-much",
        label: "Paying Too Much for SaaS",
        description: "Want to own my solution",
      },
      {
        value: "manual-processes",
        label: "Too Many Manual Processes",
        description: "Need automation tools",
      },
    ],
  },
  {
    id: "industry",
    question: "What industry are you in?",
    options: [
      {
        value: "professional-services",
        label: "Professional Services",
        description: "Consulting, legal, accounting",
      },
      { value: "healthcare", label: "Healthcare", description: "Medical, dental, wellness" },
      {
        value: "home-services",
        label: "Home Services",
        description: "HVAC, roofing, plumbing, contractors",
      },
      {
        value: "retail-ecommerce",
        label: "Retail/E-commerce",
        description: "Online or physical stores",
      },
      { value: "real-estate", label: "Real Estate", description: "Property sales or rentals" },
      { value: "technology", label: "Technology/SaaS", description: "Software or tech services" },
      { value: "hospitality", label: "Hospitality", description: "Restaurants, hotels, events" },
      { value: "other", label: "Other", description: "Not listed above" },
    ],
  },
  {
    id: "businessGoal",
    question: "What business outcomes do you want? (Select all that apply)",
    multiSelect: true,
    options: [
      {
        value: "more-customers",
        label: "Get More Customers",
        description: "Increase leads and sales",
      },
      { value: "save-time", label: "Save Time", description: "Automate repetitive tasks" },
      { value: "reduce-costs", label: "Reduce Costs", description: "Cut expensive subscriptions" },
      {
        value: "improve-credibility",
        label: "Look More Professional",
        description: "Build trust with better design",
      },
      {
        value: "scale-business",
        label: "Scale My Business",
        description: "Support growth with better systems",
      },
    ],
  },
  {
    id: "targetAudience",
    question: "Who is your primary target audience?",
    options: [
      { value: "b2b", label: "Businesses (B2B)", description: "Selling to other companies" },
      { value: "b2c", label: "Consumers (B2C)", description: "Selling to individuals" },
      { value: "both", label: "Both B2B and B2C", description: "Serve both markets" },
      { value: "internal", label: "Internal Team", description: "Tools for my own team" },
    ],
  },
  {
    id: "desiredFeatures",
    question: "What advanced features do you need? (Select all that apply)",
    multiSelect: true,
    options: [
      { value: "seo", label: "Advanced SEO", description: "Search engine optimization" },
      {
        value: "email-automation",
        label: "Email Automation",
        description: "Automated email sequences",
      },
      { value: "newsletter", label: "Newsletter Management", description: "Email list building" },
      { value: "forms", label: "Custom Forms", description: "Multi-step forms" },
      { value: "cms", label: "CMS", description: "Content management system" },
      { value: "blog", label: "Blog", description: "Blogging platform" },
      { value: "auth", label: "User Authentication", description: "Login & signup" },
      { value: "ecommerce", label: "E-commerce", description: "Cart & checkout" },
      { value: "payment", label: "Payment Processing", description: "Card processing" },
      { value: "booking", label: "Booking System", description: "Appointment scheduling" },
      { value: "api", label: "API Integration", description: "Third-party tools" },
      { value: "chat", label: "Live Chat", description: "Customer support" },
      { value: "crm", label: "CRM", description: "Customer management" },
      { value: "ai", label: "Generative AI", description: "AI-powered features" },
    ],
  },
  {
    id: "projectScope",
    question: "What type of solution fits your needs?",
    options: [
      {
        value: "simple-landing",
        label: "Simple Landing Page",
        description: "One page to capture leads",
      },
      {
        value: "full-website",
        label: "Complete Website",
        description: "Multi-page site with full content",
      },
      {
        value: "custom-app",
        label: "Custom Web Application",
        description: "Tailored tools for your workflow",
      },
      { value: "ecommerce-store", label: "E-commerce Store", description: "Sell products online" },
      { value: "not-sure", label: "Not Sure Yet", description: "Help me figure it out" },
    ],
  },
  {
    id: "existingAssets",
    question: "Do you have existing brand materials?",
    options: [
      {
        value: "full-brand",
        label: "Yes, Full Branding",
        description: "Logo, colors, fonts, guidelines",
      },
      { value: "partial-brand", label: "Some Materials", description: "Logo and colors only" },
      { value: "no-brand", label: "No, Need Help", description: "Starting from scratch" },
    ],
  },
  {
    id: "timeline",
    question: "When do you need this launched?",
    options: [
      { value: "urgent", label: "Within 4-6 Weeks", description: "Urgent business need" },
      { value: "normal", label: "6-10 Weeks", description: "Standard timeline" },
      { value: "planning", label: "10-16 Weeks", description: "Still planning details" },
      { value: "flexible", label: "16+ Weeks", description: "No immediate rush" },
    ],
  },
  {
    id: "investment",
    question: "What's your investment budget?",
    options: [
      {
        value: "budget-conscious",
        label: "$750 - $1,500",
        description: "Essential tier (1-5 pages)",
      },
      {
        value: "standard",
        label: "$1,700 - $3,000",
        description: "Professional tier (6-12 pages)",
      },
      { value: "premium", label: "$3,200 - $5,500", description: "Enterprise tier (13-20 pages)" },
      { value: "enterprise", label: "$5,500+", description: "Premium tier (21+ pages)" },
      { value: "premium-budget", label: "$8,000+", description: "Complex custom solution" },
      { value: "need-guidance", label: "Need Guidance", description: "Help me understand costs" },
    ],
  },
  {
    id: "companySize",
    question: "How many people work at your company?",
    options: [
      { value: "solo", label: "Just Me", description: "Solopreneur" },
      { value: "2-10", label: "2-10 Employees", description: "Small team" },
      { value: "11-50", label: "11-50 Employees", description: "Mid-size company" },
      { value: "51-200", label: "51-200 Employees", description: "Large company" },
      { value: "200+", label: "200+ Employees", description: "Enterprise" },
    ],
  },
  {
    id: "decisionMaker",
    question: "What's your role in this project?",
    options: [
      { value: "owner", label: "Owner/Founder", description: "I make the final decision" },
      { value: "executive", label: "Executive/C-Level", description: "I have budget authority" },
      { value: "manager", label: "Manager", description: "I'll need approval" },
      { value: "team-member", label: "Team Member", description: "I'm gathering information" },
    ],
  },
];
