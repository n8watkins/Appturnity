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
| **Landing Page** | `projectScope: 'simple-landing'` | 3-4 weeks | Under $3,000 |
| **Professional Website** | `projectScope: 'full-website'` or `'not-sure'` | 6-10 weeks | $3,000-$7,000 |
| **Custom Web Application** | `projectScope: 'custom-app'` | 12-20 weeks | $7,000-$15,000+ |
| **E-commerce Solution** | `projectScope: 'ecommerce-store'` | 10-16 weeks | $7,000-$15,000 |

### Priority Scoring System

Priority scores help prioritize leads based on three dimensions:

#### 1. Budget Score (1-4 points)

| Budget Range | Score | Value |
|--------------|-------|-------|
| Under $3,000 | 1 | `budget-conscious` |
| $3,000-$7,000 | 2 | `standard` |
| Need Guidance | 2 | `need-guidance` |
| $7,000-$15,000 | 3 | `premium` |
| $15,000+ | 4 | `enterprise` |
| Premium/No Limit | 4 | `premium-budget` |

#### 2. Urgency Score (1-4 points)

| Timeline | Score | Value |
|----------|-------|-------|
| 16+ weeks | 1 | `flexible` |
| 10-16 weeks | 2 | `planning` |
| 6-10 weeks | 3 | `normal` |
| Within 4-6 weeks | 4 | `urgent` |

#### 3. Complexity Score (1-4 points)

**Base Score from Project Scope:**
- Landing Page: 1
- Full Website: 2
- E-commerce: 3
- Custom App: 4

**Feature Complexity (Weighted):**
- Payment Processing: +2.5
- User Accounts: +2.0
- Booking/Scheduling: +2.0
- Third-party Integrations: +1.5
- Analytics Dashboard: +1.5
- Content Management: +1.0
- Contact Forms: +0.5

**Brand Assets Modifier:**
- No Brand Materials: +1.0
- Partial Brand Materials: +0.5
- Full Branding: +0.0

Feature points are scaled to a 0-2 bonus range and combined with the base score and brand modifier.

#### 4. Company Size Modifier (0-2 points)

| Company Size | Modifier |
|--------------|----------|
| Just Me (Solo) | +0 |
| 2-10 Employees | +0.5 |
| 11-50 Employees | +1.0 |
| 51-200 Employees | +1.5 |
| 200+ Employees | +2.0 |

#### 5. Decision Maker Modifier (-1 to +2 points)

| Role | Modifier | Rationale |
|------|----------|-----------|
| Owner/Founder | +2 | Fast decisions, highest authority |
| Executive/C-Level | +1 | Budget authority, high priority |
| Manager | +0 | Standard approval process |
| Team Member | -1 | Longer sales cycle, information gathering |

### Total Priority Score

**Formula (Weighted Sum):** `(Budget × 5) + (Urgency × 3) + (Complexity × 2) + CompanySize + DecisionMaker`

**Range:** 10-40+ points

**Priority Levels:**

| Score Range | Priority Level | Email Prefix | Description |
|-------------|----------------|--------------|-------------|
| 32+ | 🔥 HIGH PRIORITY | `🔥 HIGH PRIORITY -` | High budget, urgent timeline, decision authority |
| 24-31 | ⚡ MEDIUM PRIORITY | `⚡` | Mid-range opportunity with good potential |
| 10-23 | 📋 STANDARD PRIORITY | (none) | Standard lead requiring qualification |

### Example Calculations

**Example 1: High Priority Lead**
- Budget: Premium ($7k-$15k) = 4 points → 4 × 5 = 20
- Urgency: Urgent (4-6 weeks) = 4 points → 4 × 3 = 12
- Complexity: Custom App (4) + Features (0) + No Brand (1) = 4 points → 4 × 2 = 8
- Company Size: 11-50 employees = +1.0
- Decision Maker: Owner/Founder = +2.0
- **Total: 20 + 12 + 8 + 1 + 2 = 43 points (🔥 HIGH PRIORITY)**

**Example 2: Medium Priority Lead**
- Budget: Standard ($3k-$7k) = 2 points → 2 × 5 = 10
- Urgency: Normal (6-10 weeks) = 3 points → 3 × 3 = 9
- Complexity: Full Website (2) + CMS (1.0) + Partial Brand (0.5) = 3 points → 3 × 2 = 6
- Company Size: 2-10 employees = +0.5
- Decision Maker: Manager = +0
- **Total: 10 + 9 + 6 + 0.5 + 0 = 25.5 → 26 points (⚡ MEDIUM PRIORITY)**

**Example 3: Standard Lead**
- Budget: Budget Conscious (<$3k) = 1 point → 1 × 5 = 5
- Urgency: Flexible (16+ weeks) = 1 point → 1 × 3 = 3
- Complexity: Landing Page (1) + Contact Forms (0.5) + Full Brand (0) = 1 point → 1 × 2 = 2
- Company Size: Just Me = +0
- Decision Maker: Team Member = -1
- **Total: 5 + 3 + 2 + 0 - 1 = 9 points (📋 STANDARD PRIORITY)**

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
Timeline: 9-15 weeks
Budget: $7,000 - $15,000
Score: 43/40+ (Budget: 4/4, Urgency: 4/4, Complexity: 4/4)

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
   - Total priority score out of 40+
3. **Enhanced Subject Line**:
   - High Priority (32+): `🔥 HIGH PRIORITY - New Contact: John Doe`
   - Medium Priority (24-31): `⚡ New Contact: John Doe`
   - Standard (10-23): `New Contact: John Doe`

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
- **Priority thresholds:** Lines 283-287 (subject) and 188 (badge) - Currently set to 32+ for HIGH, 24+ for MEDIUM
- **HTML styling:** Lines 127-181 (CSS classes)
- **Recommendation box:** Lines 194-224
- **Score display:** Update `/40+` references if scoring range changes

## Testing

### Test Different Scenarios

```typescript
import { getRecommendation } from '@/lib/quizRecommendations';

// High priority test
const highPriority = getRecommendation({
  projectScope: 'custom-app',
  features: ['payment-processing', 'user-accounts', 'analytics'],
  timeline: 'urgent',
  investment: 'premium',
  existingAssets: 'no-brand',
  companySize: '51-200',
  decisionMaker: 'owner'
});
// Expected: priorityScore >= 32

// Standard test
const standard = getRecommendation({
  projectScope: 'simple-landing',
  features: ['contact-forms'],
  timeline: 'flexible',
  investment: 'budget-conscious',
  existingAssets: 'full-brand',
  companySize: 'solo',
  decisionMaker: 'team-member'
});
// Expected: priorityScore < 24
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
