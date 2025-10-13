// Lightweight metadata for blog listing - no content included
export interface BlogMetadata {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  featured?: boolean;
}

export const blogMetadata: BlogMetadata[] = [
  {
    id: "1",
    slug: "why-own-your-website-2025",
    title: "Why You Should Own Your Website in 2025 (Not Rent It)",
    excerpt: "Discover why owning your website outright is the smartest business decision you can make in 2025. Break free from monthly subscriptions and platform lock-in.",
    author: "Appturnity Team",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Business Strategy",
    tags: ["website ownership", "saas alternatives", "business strategy", "cost savings"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    seoTitle: "Why Own Your Website in 2025 | Save Money & Avoid Platform Lock-in",
    seoDescription: "Learn why owning your website is better than renting from SaaS platforms. Discover how to save thousands while gaining full control of your online presence.",
    seoKeywords: ["website ownership", "saas alternatives", "website cost savings", "platform lock-in", "custom website development"],
    featured: true
  },
  {
    id: "2",
    slug: "custom-website-vs-website-builder",
    title: "Custom Website vs Website Builder: Complete 2025 Comparison",
    excerpt: "Choosing between a custom website and a website builder? This detailed comparison covers costs, features, pros and cons to help you make the right decision for your business.",
    author: "Appturnity Team",
    date: "2025-01-12",
    readTime: "10 min read",
    category: "Comparisons",
    tags: ["custom website", "website builder", "wix", "squarespace", "comparison"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop",
    seoTitle: "Custom Website vs Website Builder 2025: Which Should You Choose?",
    seoDescription: "Compare custom websites vs website builders in detail. See real costs, features, and find out which option is best for your business in 2025.",
    seoKeywords: ["custom website vs website builder", "wix vs custom", "squarespace alternative", "website builder comparison"]
  },
  {
    id: "3",
    slug: "how-much-does-custom-website-cost",
    title: "How Much Does a Custom Website Really Cost in 2025?",
    excerpt: "Confused about custom website pricing? This transparent breakdown shows exactly what you pay for and how to budget for your project.",
    author: "Appturnity Team",
    date: "2025-01-10",
    readTime: "12 min read",
    category: "Pricing & Budget",
    tags: ["website cost", "pricing", "budget", "web development cost"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop",
    seoTitle: "Custom Website Cost 2025: Complete Pricing Breakdown & Guide",
    seoDescription: "Discover real custom website costs in 2025. Detailed pricing breakdown by features, complexity, and project scope. Budget accurately for your website project.",
    seoKeywords: ["custom website cost", "website development cost", "how much does a website cost", "website pricing 2025"]
  },
  {
    id: "4",
    slug: "website-planning-guide",
    title: "How to Plan Your Website Project: Step-by-Step Guide for 2025",
    excerpt: "Planning a website? This comprehensive guide walks you through requirements gathering, feature selection, budgeting, and timeline planning to ensure project success.",
    author: "Appturnity Team",
    date: "2025-01-08",
    readTime: "11 min read",
    category: "Planning & Strategy",
    tags: ["website planning", "project planning", "requirements", "strategy"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop",
    seoTitle: "Website Planning Guide 2025: How to Plan a Successful Website Project",
    seoDescription: "Complete step-by-step guide to planning your website project. Learn how to gather requirements, set budgets, choose features, and create a timeline that works.",
    seoKeywords: ["website planning", "website project plan", "how to plan a website", "website requirements"]
  },
  {
    id: "5",
    slug: "website-features-guide",
    title: "Essential Website Features Every Business Needs in 2025",
    excerpt: "Not sure which features your website needs? This guide breaks down must-have features, nice-to-haves, and costly additions you might not need.",
    author: "Appturnity Team",
    date: "2025-01-06",
    readTime: "9 min read",
    category: "Features & Functionality",
    tags: ["website features", "functionality", "web development features", "requirements"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    seoTitle: "Essential Website Features 2025: Complete Guide for Business Owners",
    seoDescription: "Discover which website features are essential, which are optional, and which to skip. Make informed decisions about your website functionality and budget.",
    seoKeywords: ["website features", "essential website features", "website functionality", "what features does my website need"]
  },
  {
    id: "6",
    slug: "seo-basics-for-business-websites",
    title: "SEO Basics for Business Websites: What Actually Works in 2025",
    excerpt: "Cut through the SEO noise. Learn the practical, proven strategies that actually improve your Google rankings and drive traffic to your business website.",
    author: "Appturnity Team",
    date: "2025-01-04",
    readTime: "10 min read",
    category: "SEO & Marketing",
    tags: ["seo", "search engine optimization", "google ranking", "organic traffic"],
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=630&fit=crop",
    seoTitle: "SEO Basics 2025: Proven Strategies That Actually Improve Rankings",
    seoDescription: "Learn practical SEO strategies that work in 2025. No jargon, no tricks—just proven techniques to help your business website rank higher in Google.",
    seoKeywords: ["seo basics", "business seo", "seo 2025", "improve google rankings", "seo for beginners"]
  },
  {
    id: "7",
    slug: "choosing-web-developer-agency",
    title: "How to Choose a Web Developer or Agency: Complete 2025 Guide",
    excerpt: "Hiring a web developer is a big decision. This guide shows you exactly what to look for, which questions to ask, and how to avoid common mistakes.",
    author: "Appturnity Team",
    date: "2025-01-02",
    readTime: "10 min read",
    category: "Hiring & Partnerships",
    tags: ["hiring", "web developer", "agency", "vendor selection"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop",
    seoTitle: "How to Choose a Web Developer 2025: Complete Hiring Guide",
    seoDescription: "Learn how to hire the right web developer or agency. Red flags, green flags, essential questions, and vendor evaluation criteria.",
    seoKeywords: ["how to choose web developer", "hiring web developer", "choose web agency", "web developer selection"]
  },
  {
    id: "8",
    slug: "website-speed-optimization",
    title: "Website Speed Optimization: Why It Matters & How to Fix It",
    excerpt: "Slow websites lose customers and ranking. Learn why speed matters for SEO and conversions, plus practical tips to make your website lightning-fast.",
    author: "Appturnity Team",
    date: "2024-12-30",
    readTime: "8 min read",
    category: "Performance & Technical",
    tags: ["website speed", "performance", "page speed", "optimization"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    seoTitle: "Website Speed Optimization 2025: Boost Performance & Conversions",
    seoDescription: "Learn how to optimize website speed for better SEO and conversions. Practical tips to reduce load time and improve user experience.",
    seoKeywords: ["website speed optimization", "improve page speed", "website performance", "faster website"]
  },
  {
    id: "9",
    slug: "mobile-first-website-design",
    title: "Mobile-First Website Design: Why It's Essential in 2025",
    excerpt: "Mobile traffic now dominates the web. Learn why mobile-first design matters and how to ensure your website works perfectly on every device.",
    author: "Appturnity Team",
    date: "2024-12-28",
    readTime: "9 min read",
    category: "Design & UX",
    tags: ["mobile design", "responsive design", "mobile-first", "user experience"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=630&fit=crop",
    seoTitle: "Mobile-First Website Design 2025: Essential Guide for Business",
    seoDescription: "Understand mobile-first design and why it's critical. Learn best practices for creating websites that work perfectly on mobile devices.",
    seoKeywords: ["mobile-first design", "responsive web design", "mobile website", "mobile optimization"]
  },
  {
    id: "10",
    slug: "website-maintenance-guide",
    title: "Website Maintenance: What You Need to Do & When",
    excerpt: "Websites need ongoing maintenance to stay secure, fast, and effective. Learn what tasks to do daily, weekly, monthly, and yearly.",
    author: "Appturnity Team",
    date: "2024-12-26",
    readTime: "10 min read",
    category: "Maintenance & Support",
    tags: ["website maintenance", "updates", "security", "backups"],
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop",
    seoTitle: "Website Maintenance Guide 2025: Essential Tasks & Schedule",
    seoDescription: "Complete website maintenance checklist. Learn what to do daily, weekly, monthly, and yearly to keep your site secure, fast, and effective.",
    seoKeywords: ["website maintenance", "website upkeep", "website maintenance checklist", "website updates"]
  }
];

// Helper functions for metadata
export function getMetadataBySlug(slug: string): BlogMetadata | undefined {
  return blogMetadata.find(post => post.slug === slug);
}

export function getMetadataByCategory(category: string): BlogMetadata[] {
  return blogMetadata.filter(post => post.category === category);
}

export function getMetadataByTag(tag: string): BlogMetadata[] {
  return blogMetadata.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogMetadata.map(post => post.category)));
}

export function getAllTags(): string[] {
  const tags = blogMetadata.flatMap(post => post.tags);
  return Array.from(new Set(tags));
}