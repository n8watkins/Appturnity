# Quiz Recommendation System Documentation

## Overview

The quiz recommendation system analyzes user responses to provide personalized solution recommendations and calculate lead priority scores for efficient lead management.

## Architecture

### Components

1. **`quizRecommendations.ts`** - Core recommendation engine logic
2. **`RecommendationCard.tsx`** - UI component displaying recommendations
3. **`Contact.tsx`** - Integration layer connecting quiz to form submission
4. **`email.ts`** - Backend email template with priority scoring

### Data Flow

```
Quiz Completion
    ↓
Generate Recommendation (quizRecommendations.ts)
    ↓
Display RecommendationCard
    ↓
User Fills Contact Form
    ↓
Submit with Recommendation Data
    ↓
Email with Priority Score
```

## Recommendation Logic

### Solution Types

The system recommends one of four solution types:

| Type | Trigger | Timeline | Investment Range |
|------|---------|----------|------------------|
| **Landing Page** | `projectScope: 'simple-landing'` | 2-3 weeks | Under $3,000 |
| **Professional Website** | `projectScope: 'full-website'` or `'not-sure'` | 4-6 weeks | $3,000-$7,000 |
| **Custom Web Application** | `projectScope: 'custom-app'` | 8-12 weeks | $7,000-$15,000+ |
| **E-commerce Solution** | `projectScope: 'ecommerce-store'` | 6-10 weeks | $7,000-$15,000 |

### Priority Scoring System

Priority scores help prioritize leads based on three dimensions:

#### 1. Budget Score (1-4 points)

| Budget Range | Score | Value |
|--------------|-------|-------|
| Under $3,000 | 1 | `budget-conscious` |
| $3,000-$7,000 | 2 | `standard` |
| $7,000-$15,000 | 3 | `premium` |
| $15,000+ or Flexible | 4 | `enterprise` / `flexible` |

#### 2. Urgency Score (1-4 points)

| Timeline | Score | Value |
|----------|-------|-------|
| 3+ months | 1 | `flexible` |
| 2-3 months | 2 | `planning` |
| 1-2 months | 3 | `normal` |
| Within 2-4 weeks | 4 | `urgent` |

#### 3. Complexity Score (1-4 points)

**Base Score from Project Scope:**
- Landing Page: 1
- Full Website: 2
- E-commerce: 3
- Custom App: 4

**Adjustments:**
- +1 if complex features selected (payment processing, user accounts, booking, integrations, analytics)
- Maximum score: 4

### Total Priority Score

**Formula:** `Budget × Urgency × Complexity`

**Range:** 1-64 points

**Priority Levels:**

| Score Range | Priority Level | Email Prefix | Description |
|-------------|----------------|--------------|-------------|
| 24-64 | 🔥 HIGH PRIORITY | `🔥 HIGH PRIORITY -` | High budget, urgent timeline, complex project |
| 12-23 | ⚡ MEDIUM PRIORITY | `⚡` | Mid-range opportunity |
| 1-11 | 📋 STANDARD PRIORITY | (none) | Standard lead |

### Example Calculations

**Example 1: High Priority Lead**
- Budget: Premium ($7k-$15k) = 3 points
- Timeline: Urgent (2-4 weeks) = 4 points
- Complexity: Custom App + Complex Features = 4 points
- **Total: 3 × 4 × 4 = 48 points (🔥 HIGH PRIORITY)**

**Example 2: Medium Priority Lead**
- Budget: Standard ($3k-$7k) = 2 points
- Timeline: Normal (1-2 months) = 3 points
- Complexity: Full Website = 2 points
- **Total: 2 × 3 × 2 = 12 points (⚡ MEDIUM PRIORITY)**

**Example 3: Standard Lead**
- Budget: Budget Conscious (<$3k) = 1 point
- Timeline: Flexible (3+ months) = 1 point
- Complexity: Landing Page = 1 point
- **Total: 1 × 1 × 1 = 1 point (📋 STANDARD PRIORITY)**

## Features Mapping

The recommendation includes a list of features based on quiz selections:

### Always Included
- Custom design tailored to your brand
- Mobile responsive across all devices
- SEO optimization

### Conditional Includes

| Quiz Selection | Added Feature |
|----------------|---------------|
| `contact-forms` | Contact forms & lead capture |
| `booking-scheduling` | Appointment booking system |
| `payment-processing` | Secure payment processing |
| `user-accounts` | User authentication & accounts |
| `cms` | Easy content management system |
| `analytics` | Analytics dashboard & tracking |
| `integrations` | Third-party integrations |

### Solution Type Specific

| Solution Type | Page Count Feature |
|---------------|-------------------|
| Landing Page | 1-3 high-converting pages |
| Website | 5-10 professionally designed pages |
| Custom App | Custom application architecture |
| E-commerce | Product catalog and shopping cart |

## "Best For" Description

Dynamically generated based on industry and primary business goal:

**Format:** `{industry} looking to {primary_goal}`

**Examples:**
- "Healthcare providers looking to generate more leads"
- "Professional services looking to save time with automation"
- "Home service businesses looking to build credibility"

## Email Template

### Development Mode Output

```
============================================================
📧 DEVELOPMENT MODE: Email not sent (no RESEND_API_KEY)
============================================================
From: John Doe <john@example.com>

🔥 HIGH PRIORITY
Solution: Custom Web Application
Timeline: 7-11 weeks
Budget: $7,000 - $15,000
Score: 48/64 (Budget: 3/4, Urgency: 4/4, Complexity: 4/4)

Message:
[formatted quiz results]
============================================================
```

### Production Email Features

1. **Priority Badge** in email header (color-coded)
2. **Recommendation Box** with:
   - Solution name
   - Timeline estimate
   - Budget range
   - Score breakdown grid (Budget/Urgency/Complexity)
3. **Enhanced Subject Line**:
   - High Priority: `🔥 HIGH PRIORITY - New Contact: John Doe`
   - Medium Priority: `⚡ New Contact: John Doe`
   - Standard: `New Contact: John Doe`

## Updating the System

### Adding a New Solution Type

1. Add to `solutionType` in `quizRecommendations.ts:15`
2. Update `getSolutionName()` with display name
3. Update `getSolutionDescription()` with description
4. Update `getTimelineEstimate()` with timeline
5. Update `buildIncludesList()` for type-specific features

### Modifying Score Calculations

Edit these functions in `quizRecommendations.ts`:
- `getBudgetScore()` - Budget scoring logic
- `getUrgencyScore()` - Timeline scoring logic
- `getComplexityScore()` - Complexity calculation
- `getPriorityLabel()` - Priority level thresholds

### Customizing Email Template

Edit `server/email.ts`:
- **Priority thresholds:** Lines 283-287 (subject) and 188 (badge)
- **HTML styling:** Lines 127-181 (CSS classes)
- **Recommendation box:** Lines 194-224

## Testing

### Test Different Scenarios

```typescript
import { getRecommendation } from '@/lib/quizRecommendations';

// High priority test
const highPriority = getRecommendation({
  projectScope: 'custom-app',
  features: ['payment-processing', 'user-accounts', 'analytics'],
  timeline: 'urgent',
  investment: 'premium'
});
// Expected: priorityScore >= 24

// Standard test
const standard = getRecommendation({
  projectScope: 'simple-landing',
  features: ['contact-forms'],
  timeline: 'flexible',
  investment: 'budget-conscious'
});
// Expected: priorityScore < 12
```

## Best Practices

1. **Review Recommendations:** Periodically review generated recommendations to ensure accuracy
2. **Update Timelines:** Adjust timeline estimates based on actual project delivery times
3. **Monitor Score Distribution:** Track priority score distribution to calibrate thresholds
4. **Customize for Business:** Modify scoring weights based on your ideal customer profile
5. **Test Email Rendering:** Send test emails to verify HTML rendering across email clients

## Future Enhancements

Potential improvements to consider:

- A/B test different recommendation formats
- Add recommendation confidence scores
- Track conversion rates by recommendation type
- Implement machine learning to optimize scoring
- Add seasonal adjustments (holiday rush, slow periods)
- Industry-specific timeline multipliers
- Custom scoring profiles for different service tiers
