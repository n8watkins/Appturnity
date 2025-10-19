/**
 * Quiz Recommendation Engine
 *
 * Analyzes quiz answers to provide personalized solution recommendations
 * and calculate lead priority scores for backend processing.
 *
 * The recommendation algorithm uses a multi-factor scoring system:
 *
 * 1. **Budget Score** (1-4 points):
 *    - Budget-conscious: 1 point
 *    - Standard: 2 points
 *    - Premium: 3 points
 *    - Enterprise/No limit: 4 points
 *
 * 2. **Urgency Score** (1-4 points):
 *    - Flexible timeline: 1 point
 *    - Planning phase: 2 points
 *    - Normal timeline: 3 points
 *    - Urgent: 4 points
 *
 * 3. **Complexity Score** (1-4 points):
 *    - Based on project scope, feature requirements, and existing assets
 *    - Simple landing page: 1 point
 *    - Multi-page website: 2 points
 *    - Complex features: 3 points
 *    - Custom application: 4 points
 *
 * **Priority Score Formula**:
 * Base Score = (Budget × 5) + (Urgency × 3) + (Complexity × 2)
 * Final Score = Base Score + Company Size Modifier + Decision Maker Modifier
 *
 * This creates a weighted distribution of roughly 50% budget, 30% urgency, 20% complexity.
 * Score range: 10-40+ (with modifiers)
 *
 * Priority labels:
 * - HIGH: 32+ points
 * - MEDIUM: 24-31 points
 * - STANDARD: <24 points
 */

// Quiz discount percentage
const QUIZ_DISCOUNT_PERCENT = 10;

export interface QuizAnswers {
  currentSituation?: string | string[];
  industry?: string | string[];
  businessGoal?: string | string[];
  targetAudience?: string | string[];
  features?: string | string[];
  projectScope?: string | string[];
  existingAssets?: string | string[];
  timeline?: string | string[];
  investment?: string | string[];
  companySize?: string | string[];
  decisionMaker?: string | string[];
}

export interface Recommendation {
  solutionName: string;
  solutionType: "landing" | "website" | "app" | "ecommerce";
  description: string;
  bestFor: string;
  timeline: string;
  investmentRange: string;
  includes: string[];
  priorityScore: number;
  scores: {
    budget: number;
    urgency: number;
    complexity: number;
  };
  quizDiscount: {
    percent: number;
    applied: boolean;
  };
}

/**
 * Calculate budget score (1-4 points)
 *
 * Evaluates the user's budget capacity to prioritize high-value leads.
 *
 * @param investment - Budget preference from quiz ("budget-conscious" | "standard" | "premium" | "enterprise")
 * @returns Score from 1-4, where 4 = highest budget capacity
 */
function getBudgetScore(investment?: string | string[]): number {
  const budget = Array.isArray(investment) ? investment[0] : investment;

  switch (budget) {
    case "budget-conscious":
      return 1;
    case "standard":
      return 2;
    case "need-guidance":
      return 2; // Needs qualification, treat as standard for now
    case "premium":
      return 3;
    case "enterprise":
    case "premium-budget":
      return 4; // High budget / no limit
    default:
      return 2; // Default to standard
  }
}

/**
 * Calculate urgency score (1-4 points)
 *
 * Evaluates project timeline to prioritize leads ready to start soon.
 *
 * @param timeline - Timeline preference from quiz ("flexible" | "planning" | "normal" | "urgent")
 * @returns Score from 1-4, where 4 = most urgent
 */
function getUrgencyScore(timeline?: string | string[]): number {
  const time = Array.isArray(timeline) ? timeline[0] : timeline;

  switch (time) {
    case "flexible":
      return 1;
    case "planning":
      return 2;
    case "normal":
      return 3;
    case "urgent":
      return 4;
    default:
      return 2;
  }
}

/**
 * Calculate complexity score (1-4 points) with weighted features and brand assets
 *
 * Evaluates project complexity based on scope, features, and existing assets.
 * More complex projects may require more resources but also higher budgets.
 *
 * @param answers - Complete quiz answers including scope, features, and assets
 * @returns Score from 1-4, where 4 = most complex project
 */
function getComplexityScore(answers: QuizAnswers): number {
  const scope = Array.isArray(answers.projectScope)
    ? answers.projectScope[0]
    : answers.projectScope;

  const features = Array.isArray(answers.features) ? answers.features : [];

  const assets = Array.isArray(answers.existingAssets)
    ? answers.existingAssets[0]
    : answers.existingAssets;

  // Base score from project scope
  let baseScore = 1;
  switch (scope) {
    case "simple-landing":
      baseScore = 1;
      break;
    case "full-website":
      baseScore = 2;
      break;
    case "ecommerce-store":
      baseScore = 3;
      break;
    case "custom-app":
      baseScore = 4;
      break;
    case "not-sure":
      baseScore = 2; // Default to website complexity
      break;
  }

  // Weighted feature complexity (new approach)
  let featurePoints = 0;
  const featureWeights: Record<string, number> = {
    "payment-processing": 2.5,
    "user-accounts": 2.0,
    "booking-scheduling": 2.0,
    integrations: 1.5,
    analytics: 1.5,
    cms: 1.0,
    "contact-forms": 0.5,
  };

  features.forEach((feature) => {
    featurePoints += featureWeights[feature as string] || 0;
  });

  // Scale feature points to 0-2 bonus range
  let featureBonus = 0;
  if (featurePoints >= 5.5) featureBonus = 2;
  else if (featurePoints >= 3.5) featureBonus = 1.5;
  else if (featurePoints >= 1.5) featureBonus = 1;
  else if (featurePoints >= 0.5) featureBonus = 0.5;

  // Brand assets complexity modifier
  let brandModifier = 0;
  if (assets === "no-brand") {
    brandModifier = 1; // Significant additional work
  } else if (assets === "partial-brand") {
    brandModifier = 0.5;
  }

  // Combine all factors
  const totalScore = baseScore + featureBonus + brandModifier;

  // Cap at 4, floor at 1
  return Math.max(1, Math.min(4, Math.round(totalScore)));
}

/**
 * Determine solution type based on quiz answers
 */
function determineSolutionType(answers: QuizAnswers): Recommendation["solutionType"] {
  const scope = Array.isArray(answers.projectScope)
    ? answers.projectScope[0]
    : answers.projectScope;

  switch (scope) {
    case "simple-landing":
      return "landing";
    case "ecommerce-store":
      return "ecommerce";
    case "custom-app":
      return "app";
    case "full-website":
    case "not-sure":
    default:
      return "website";
  }
}

/**
 * Get investment range text based on actual pricing structure
 * With quiz discount applied
 */
function getInvestmentRange(investment?: string | string[]): string {
  const budget = Array.isArray(investment) ? investment[0] : investment;

  // Helper to apply discount to a value
  const applyDiscount = (value: number) => Math.round(value * (1 - QUIZ_DISCOUNT_PERCENT / 100));

  switch (budget) {
    case "budget-conscious":
      return `$${applyDiscount(750).toLocaleString()} - $${applyDiscount(1500).toLocaleString()}`;
    case "standard":
      return `$${applyDiscount(1700).toLocaleString()} - $${applyDiscount(3000).toLocaleString()}`;
    case "need-guidance":
      return `$${applyDiscount(1500).toLocaleString()} - $${applyDiscount(3500).toLocaleString()}`;
    case "premium":
      return `$${applyDiscount(3200).toLocaleString()} - $${applyDiscount(5500).toLocaleString()}`;
    case "enterprise":
      return `$${applyDiscount(5500).toLocaleString()}+`;
    case "premium-budget":
      return `$${applyDiscount(8000).toLocaleString()}+`;
    default:
      return `$${applyDiscount(1700).toLocaleString()} - $${applyDiscount(3000).toLocaleString()}`;
  }
}

/**
 * Get timeline estimate based on solution type and urgency
 * Updated with realistic timelines
 */
function getTimelineEstimate(
  solutionType: Recommendation["solutionType"],
  timeline?: string | string[]
): string {
  const time = Array.isArray(timeline) ? timeline[0] : timeline;

  const estimates: Record<Recommendation["solutionType"], string> = {
    landing: "3-4 weeks",
    website: "6-10 weeks",
    app: "12-20 weeks",
    ecommerce: "10-16 weeks",
  };

  let estimate = estimates[solutionType];

  // Adjust for urgent timeline (reduce by ~25%)
  if (time === "urgent") {
    estimate = estimate.replace(/(\d+)-(\d+)/, (_, start, end) => {
      const newStart = Math.max(2, Math.round(parseInt(start) * 0.75));
      const newEnd = Math.max(3, Math.round(parseInt(end) * 0.75));
      return `${newStart}-${newEnd}`;
    });
  }

  return estimate;
}

/**
 * Build includes list based on features and solution type
 */
function buildIncludesList(
  answers: QuizAnswers,
  solutionType: Recommendation["solutionType"]
): string[] {
  const features = Array.isArray(answers.features) ? answers.features : [];

  const includes: string[] = [
    "Custom design tailored to your brand",
    "Mobile responsive across all devices",
  ];

  // Add page count based on solution type
  if (solutionType === "landing") {
    includes.push("1-3 high-converting pages");
  } else if (solutionType === "website") {
    includes.push("5-10 professionally designed pages");
  } else if (solutionType === "app") {
    includes.push("Custom application architecture");
  } else if (solutionType === "ecommerce") {
    includes.push("Product catalog and shopping cart");
  }

  // Add feature-specific includes
  if (features.includes("contact-forms")) {
    includes.push("Contact forms & lead capture");
  }
  if (features.includes("booking-scheduling")) {
    includes.push("Appointment booking system");
  }
  if (features.includes("payment-processing")) {
    includes.push("Secure payment processing");
  }
  if (features.includes("user-accounts")) {
    includes.push("User authentication & accounts");
  }
  if (features.includes("cms")) {
    includes.push("Easy content management system");
  }
  if (features.includes("analytics")) {
    includes.push("Analytics dashboard & tracking");
  }
  if (features.includes("integrations")) {
    includes.push("Third-party integrations");
  }

  // Always add SEO
  if (!includes.some((item) => item.includes("SEO"))) {
    includes.push("SEO optimization");
  }

  return includes;
}

/**
 * Get "best for" description based on industry and goals
 */
function getBestForDescription(answers: QuizAnswers): string {
  const industry = Array.isArray(answers.industry) ? answers.industry[0] : answers.industry;

  const goals = Array.isArray(answers.businessGoal) ? answers.businessGoal : [];

  const industryMap: Record<string, string> = {
    "professional-services": "professional services",
    healthcare: "healthcare providers",
    "home-services": "home service businesses",
    "retail-ecommerce": "retail & e-commerce",
    "real-estate": "real estate professionals",
    technology: "technology companies",
    hospitality: "hospitality businesses",
    other: "businesses",
  };

  const goalMap: Record<string, string> = {
    "more-customers": "generate more leads",
    "save-time": "save time with automation",
    "reduce-costs": "reduce software costs",
    "improve-credibility": "build credibility",
    "scale-business": "scale operations",
  };

  const industryText = industryMap[industry || "other"] || "businesses";
  const primaryGoal = goals[0] as string;
  const goalText = goalMap[primaryGoal] || "grow their business";

  return `${industryText} looking to ${goalText}`;
}

/**
 * Get solution name based on type
 */
function getSolutionName(solutionType: Recommendation["solutionType"]): string {
  const names: Record<Recommendation["solutionType"], string> = {
    landing: "Lead Generation Landing Page",
    website: "Professional Website",
    app: "Custom Web Application",
    ecommerce: "E-commerce Solution",
  };

  return names[solutionType];
}

/**
 * Get solution description
 */
function getSolutionDescription(solutionType: Recommendation["solutionType"]): string {
  const descriptions: Record<Recommendation["solutionType"], string> = {
    landing:
      "A focused, high-converting landing page designed to capture leads and drive action. Perfect for marketing campaigns and product launches.",
    website:
      "A comprehensive website with multiple pages showcasing your services, building credibility, and converting visitors into customers.",
    app: "A custom web application tailored to your unique workflow, automating processes and streamlining operations for maximum efficiency.",
    ecommerce:
      "A complete online store with product management, secure checkout, and payment processing to sell your products online.",
  };

  return descriptions[solutionType];
}

/**
 * Get company size budget modifier
 */
function getCompanySizeModifier(companySize?: string | string[]): number {
  const size = Array.isArray(companySize) ? companySize[0] : companySize;

  switch (size) {
    case "solo":
      return 0; // Solopreneur: Standard
    case "2-10":
      return 0.5; // Small team: slight boost
    case "11-50":
      return 1; // Mid-size: moderate boost
    case "51-200":
      return 1.5; // Large: significant boost
    case "200+":
      return 2; // Enterprise: maximum boost
    default:
      return 0;
  }
}

/**
 * Get decision maker priority modifier
 */
function getDecisionMakerModifier(decisionMaker?: string | string[]): number {
  const role = Array.isArray(decisionMaker) ? decisionMaker[0] : decisionMaker;

  switch (role) {
    case "owner":
      return 2; // Owner/Founder: highest priority (fast decisions)
    case "executive":
      return 1; // C-Level: high priority
    case "manager":
      return 0; // Manager: standard priority
    case "team-member":
      return -1; // Team member: lower priority (long sales cycle)
    default:
      return 0;
  }
}

/**
 * Main function to generate recommendation from quiz answers
 *
 * NEW FORMULA: Weighted Sum Approach
 * Score = (Budget × 5) + (Urgency × 3) + (Complexity × 2) + Modifiers
 * Range: 10-40+ (with modifiers)
 */
export function getRecommendation(answers: QuizAnswers): Recommendation {
  const budgetScore = getBudgetScore(answers.investment);
  const urgencyScore = getUrgencyScore(answers.timeline);
  const complexityScore = getComplexityScore(answers);

  // Get modifiers
  const companySizeModifier = getCompanySizeModifier(answers.companySize);
  const decisionMakerModifier = getDecisionMakerModifier(answers.decisionMaker);

  // Weighted sum formula (Budget weighted 50%, Urgency 30%, Complexity 20%)
  const basePriorityScore = budgetScore * 5 + urgencyScore * 3 + complexityScore * 2;

  // Apply modifiers
  const priorityScore = Math.round(basePriorityScore + companySizeModifier + decisionMakerModifier);

  const solutionType = determineSolutionType(answers);

  return {
    solutionName: getSolutionName(solutionType),
    solutionType,
    description: getSolutionDescription(solutionType),
    bestFor: getBestForDescription(answers),
    timeline: getTimelineEstimate(solutionType, answers.timeline),
    investmentRange: getInvestmentRange(answers.investment),
    includes: buildIncludesList(answers, solutionType),
    priorityScore,
    scores: {
      budget: budgetScore,
      urgency: urgencyScore,
      complexity: complexityScore,
    },
    quizDiscount: {
      percent: QUIZ_DISCOUNT_PERCENT,
      applied: true,
    },
  };
}

/**
 * Get priority label based on score
 * New range: 10-40+ (weighted sum approach)
 */
export function getPriorityLabel(score: number): string {
  if (score >= 32) return "🔥 HIGH PRIORITY";
  if (score >= 24) return "⚡ MEDIUM PRIORITY";
  return "📋 STANDARD PRIORITY";
}
