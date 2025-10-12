/**
 * Quiz Recommendation Engine
 *
 * Analyzes quiz answers to provide personalized solution recommendations
 * and calculate lead priority scores for backend processing.
 */

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
}

export interface Recommendation {
  solutionName: string;
  solutionType: 'landing' | 'website' | 'app' | 'ecommerce';
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
}

/**
 * Calculate budget score (1-4 points)
 */
function getBudgetScore(investment?: string | string[]): number {
  const budget = Array.isArray(investment) ? investment[0] : investment;

  switch (budget) {
    case 'budget-conscious':
      return 1;
    case 'standard':
      return 2;
    case 'premium':
      return 3;
    case 'enterprise':
    case 'flexible':
      return 4;
    default:
      return 2; // Default to standard
  }
}

/**
 * Calculate urgency score (1-4 points)
 */
function getUrgencyScore(timeline?: string | string[]): number {
  const time = Array.isArray(timeline) ? timeline[0] : timeline;

  switch (time) {
    case 'flexible':
      return 1;
    case 'planning':
      return 2;
    case 'normal':
      return 3;
    case 'urgent':
      return 4;
    default:
      return 2;
  }
}

/**
 * Calculate complexity score (1-4 points)
 */
function getComplexityScore(answers: QuizAnswers): number {
  const scope = Array.isArray(answers.projectScope)
    ? answers.projectScope[0]
    : answers.projectScope;

  const features = Array.isArray(answers.features)
    ? answers.features
    : [];

  let score = 1;

  // Base score from project scope
  switch (scope) {
    case 'simple-landing':
      score = 1;
      break;
    case 'full-website':
      score = 2;
      break;
    case 'ecommerce-store':
      score = 3;
      break;
    case 'custom-app':
      score = 4;
      break;
    case 'not-sure':
      score = 2; // Default to website complexity
      break;
  }

  // Adjust for feature complexity
  const complexFeatures = [
    'payment-processing',
    'user-accounts',
    'booking-scheduling',
    'integrations',
    'analytics'
  ];

  const hasComplexFeatures = features.some(f =>
    complexFeatures.includes(f as string)
  );

  if (hasComplexFeatures && score < 4) {
    score += 1;
  }

  return Math.min(score, 4);
}

/**
 * Determine solution type based on quiz answers
 */
function determineSolutionType(answers: QuizAnswers): Recommendation['solutionType'] {
  const scope = Array.isArray(answers.projectScope)
    ? answers.projectScope[0]
    : answers.projectScope;

  switch (scope) {
    case 'simple-landing':
      return 'landing';
    case 'ecommerce-store':
      return 'ecommerce';
    case 'custom-app':
      return 'app';
    case 'full-website':
    case 'not-sure':
    default:
      return 'website';
  }
}

/**
 * Get investment range text
 */
function getInvestmentRange(investment?: string | string[]): string {
  const budget = Array.isArray(investment) ? investment[0] : investment;

  switch (budget) {
    case 'budget-conscious':
      return 'Under $3,000';
    case 'standard':
      return '$3,000 - $7,000';
    case 'premium':
      return '$7,000 - $15,000';
    case 'enterprise':
      return '$15,000+';
    case 'flexible':
      return '$3,000 - $15,000+';
    default:
      return '$3,000 - $7,000';
  }
}

/**
 * Get timeline estimate based on solution type and urgency
 */
function getTimelineEstimate(solutionType: Recommendation['solutionType'], timeline?: string | string[]): string {
  const time = Array.isArray(timeline) ? timeline[0] : timeline;

  const estimates: Record<Recommendation['solutionType'], string> = {
    'landing': '2-3 weeks',
    'website': '4-6 weeks',
    'app': '8-12 weeks',
    'ecommerce': '6-10 weeks',
  };

  let estimate = estimates[solutionType];

  // Adjust for urgent timeline
  if (time === 'urgent') {
    estimate = estimate.replace(/(\d+)-(\d+)/, (_, start, end) => {
      const newStart = Math.max(1, parseInt(start) - 1);
      const newEnd = Math.max(2, parseInt(end) - 1);
      return `${newStart}-${newEnd}`;
    });
  }

  return estimate;
}

/**
 * Build includes list based on features and solution type
 */
function buildIncludesList(answers: QuizAnswers, solutionType: Recommendation['solutionType']): string[] {
  const features = Array.isArray(answers.features)
    ? answers.features
    : [];

  const includes: string[] = [
    'Custom design tailored to your brand',
    'Mobile responsive across all devices',
  ];

  // Add page count based on solution type
  if (solutionType === 'landing') {
    includes.push('1-3 high-converting pages');
  } else if (solutionType === 'website') {
    includes.push('5-10 professionally designed pages');
  } else if (solutionType === 'app') {
    includes.push('Custom application architecture');
  } else if (solutionType === 'ecommerce') {
    includes.push('Product catalog and shopping cart');
  }

  // Add feature-specific includes
  if (features.includes('contact-forms')) {
    includes.push('Contact forms & lead capture');
  }
  if (features.includes('booking-scheduling')) {
    includes.push('Appointment booking system');
  }
  if (features.includes('payment-processing')) {
    includes.push('Secure payment processing');
  }
  if (features.includes('user-accounts')) {
    includes.push('User authentication & accounts');
  }
  if (features.includes('cms')) {
    includes.push('Easy content management system');
  }
  if (features.includes('analytics')) {
    includes.push('Analytics dashboard & tracking');
  }
  if (features.includes('integrations')) {
    includes.push('Third-party integrations');
  }

  // Always add SEO
  if (!includes.some(item => item.includes('SEO'))) {
    includes.push('SEO optimization');
  }

  return includes;
}

/**
 * Get "best for" description based on industry and goals
 */
function getBestForDescription(answers: QuizAnswers): string {
  const industry = Array.isArray(answers.industry)
    ? answers.industry[0]
    : answers.industry;

  const goals = Array.isArray(answers.businessGoal)
    ? answers.businessGoal
    : [];

  const industryMap: Record<string, string> = {
    'professional-services': 'professional services',
    'healthcare': 'healthcare providers',
    'home-services': 'home service businesses',
    'retail-ecommerce': 'retail & e-commerce',
    'real-estate': 'real estate professionals',
    'technology': 'technology companies',
    'hospitality': 'hospitality businesses',
    'other': 'businesses',
  };

  const goalMap: Record<string, string> = {
    'more-customers': 'generate more leads',
    'save-time': 'save time with automation',
    'reduce-costs': 'reduce software costs',
    'improve-credibility': 'build credibility',
    'scale-business': 'scale operations',
  };

  const industryText = industryMap[industry || 'other'] || 'businesses';
  const primaryGoal = goals[0] as string;
  const goalText = goalMap[primaryGoal] || 'grow their business';

  return `${industryText} looking to ${goalText}`;
}

/**
 * Get solution name based on type
 */
function getSolutionName(solutionType: Recommendation['solutionType']): string {
  const names: Record<Recommendation['solutionType'], string> = {
    'landing': 'Lead Generation Landing Page',
    'website': 'Professional Website',
    'app': 'Custom Web Application',
    'ecommerce': 'E-commerce Solution',
  };

  return names[solutionType];
}

/**
 * Get solution description
 */
function getSolutionDescription(solutionType: Recommendation['solutionType']): string {
  const descriptions: Record<Recommendation['solutionType'], string> = {
    'landing': 'A focused, high-converting landing page designed to capture leads and drive action. Perfect for marketing campaigns and product launches.',
    'website': 'A comprehensive website with multiple pages showcasing your services, building credibility, and converting visitors into customers.',
    'app': 'A custom web application tailored to your unique workflow, automating processes and streamlining operations for maximum efficiency.',
    'ecommerce': 'A complete online store with product management, secure checkout, and payment processing to sell your products online.',
  };

  return descriptions[solutionType];
}

/**
 * Main function to generate recommendation from quiz answers
 */
export function getRecommendation(answers: QuizAnswers): Recommendation {
  const budgetScore = getBudgetScore(answers.investment);
  const urgencyScore = getUrgencyScore(answers.timeline);
  const complexityScore = getComplexityScore(answers);

  // Priority score: Budget × Urgency × Complexity (max 64)
  const priorityScore = budgetScore * urgencyScore * complexityScore;

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
  };
}

/**
 * Get priority label based on score
 */
export function getPriorityLabel(score: number): string {
  if (score >= 24) return '🔥 HIGH PRIORITY';
  if (score >= 12) return '⚡ MEDIUM PRIORITY';
  return '📋 STANDARD PRIORITY';
}
