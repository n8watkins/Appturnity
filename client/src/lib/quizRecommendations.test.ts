import { describe, it, expect } from "vitest";
import { getRecommendation, getPriorityLabel, type QuizAnswers } from "./quizRecommendations";

describe("Quiz Recommendation Engine", () => {
  describe("High Priority Lead Detection", () => {
    it("marks enterprise + urgent + complex + owner as high priority", () => {
      const highValueLead: QuizAnswers = {
        investment: "enterprise",
        timeline: "urgent",
        projectScope: "custom-app",
        features: ["payment-processing", "user-accounts", "booking-scheduling"],
        existingAssets: "no-brand",
        companySize: "200+",
        decisionMaker: "owner",
      };

      const result = getRecommendation(highValueLead);

      // Should be high priority (score >= 32)
      expect(result.priorityScore).toBeGreaterThanOrEqual(32);
      expect(getPriorityLabel(result.priorityScore)).toBe("🔥 HIGH PRIORITY");
    });

    it("marks premium + urgent + ecommerce as high priority", () => {
      const premiumLead: QuizAnswers = {
        investment: "premium",
        timeline: "urgent",
        projectScope: "ecommerce-store",
        features: ["payment-processing", "user-accounts"],
        companySize: "51-200",
        decisionMaker: "executive",
      };

      const result = getRecommendation(premiumLead);

      expect(result.priorityScore).toBeGreaterThanOrEqual(32);
      expect(result.solutionType).toBe("ecommerce");
    });

    it("includes owner decision-maker bonus in calculation", () => {
      const withOwner: QuizAnswers = {
        investment: "premium",
        timeline: "normal",
        projectScope: "full-website",
        decisionMaker: "owner", // +2 bonus
      };

      const withoutOwner: QuizAnswers = {
        investment: "premium",
        timeline: "normal",
        projectScope: "full-website",
        decisionMaker: "manager", // 0 bonus
      };

      const ownerResult = getRecommendation(withOwner);
      const managerResult = getRecommendation(withoutOwner);

      expect(ownerResult.priorityScore).toBeGreaterThan(managerResult.priorityScore);
      expect(ownerResult.priorityScore - managerResult.priorityScore).toBe(2);
    });
  });

  describe("Medium Priority Lead Detection", () => {
    it("marks standard + normal + website as medium priority", () => {
      const mediumLead: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        features: ["cms", "contact-forms"],
        companySize: "11-50",
        decisionMaker: "executive",
      };

      const result = getRecommendation(mediumLead);

      // Should be medium priority (24 <= score < 32)
      expect(result.priorityScore).toBeGreaterThanOrEqual(24);
      expect(result.priorityScore).toBeLessThan(32);
      expect(getPriorityLabel(result.priorityScore)).toBe("⚡ MEDIUM PRIORITY");
    });
  });

  describe("Standard Priority Lead Detection", () => {
    it("marks budget + flexible + simple landing as standard priority", () => {
      const lowValueLead: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "flexible",
        projectScope: "simple-landing",
        features: ["contact-forms"],
        companySize: "solo",
        decisionMaker: "team-member",
      };

      const result = getRecommendation(lowValueLead);

      // Should be standard priority (score < 24)
      expect(result.priorityScore).toBeLessThan(24);
      expect(getPriorityLabel(result.priorityScore)).toBe("📋 STANDARD PRIORITY");
    });

    it("penalizes team-member decision makers", () => {
      const teamMemberLead: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        decisionMaker: "team-member", // -1 penalty
      };

      const managerLead: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        decisionMaker: "manager", // 0 penalty
      };

      const teamResult = getRecommendation(teamMemberLead);
      const managerResult = getRecommendation(managerLead);

      expect(teamResult.priorityScore).toBeLessThan(managerResult.priorityScore);
      expect(managerResult.priorityScore - teamResult.priorityScore).toBe(1);
    });
  });

  describe("Quiz Discount Application", () => {
    it("applies 10% discount to investment range", () => {
      const answers: QuizAnswers = {
        investment: "standard", // Original: $1700-$3000
        timeline: "normal",
        projectScope: "full-website",
      };

      const result = getRecommendation(answers);

      // Should show discounted prices: 1700*0.9 = 1530, 3000*0.9 = 2700
      expect(result.investmentRange).toBe("$1,530 - $2,700");
      expect(result.quizDiscount.percent).toBe(10);
      expect(result.quizDiscount.applied).toBe(true);
    });

    it("applies discount to premium budget", () => {
      const answers: QuizAnswers = {
        investment: "premium", // Original: $3200-$5500
        timeline: "normal",
        projectScope: "full-website",
      };

      const result = getRecommendation(answers);

      // Discounted: 3200*0.9 = 2880, 5500*0.9 = 4950
      expect(result.investmentRange).toBe("$2,880 - $4,950");
    });

    it("applies discount to enterprise budget", () => {
      const answers: QuizAnswers = {
        investment: "enterprise", // Original: $5500+
        timeline: "normal",
        projectScope: "custom-app",
      };

      const result = getRecommendation(answers);

      // Discounted: 5500*0.9 = 4950
      expect(result.investmentRange).toBe("$4,950+");
    });
  });

  describe("Priority Score Calculation", () => {
    it("uses weighted formula: Budget×5 + Urgency×3 + Complexity×2", () => {
      const answers: QuizAnswers = {
        investment: "premium", // Budget score: 3
        timeline: "urgent", // Urgency score: 4
        projectScope: "custom-app", // Complexity score: 4
        features: [],
      };

      const result = getRecommendation(answers);

      // Expected: 3*5 + 4*3 + 4*2 = 15 + 12 + 8 = 35
      expect(result.scores.budget).toBe(3);
      expect(result.scores.urgency).toBe(4);
      expect(result.scores.complexity).toBe(4);
      expect(result.priorityScore).toBe(35);
    });

    it("includes company size modifier in total score", () => {
      const withEnterprise: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        companySize: "200+", // +2 modifier
      };

      const withSolo: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        companySize: "solo", // +0 modifier
      };

      const enterpriseResult = getRecommendation(withEnterprise);
      const soloResult = getRecommendation(withSolo);

      expect(enterpriseResult.priorityScore).toBeGreaterThan(soloResult.priorityScore);
      expect(enterpriseResult.priorityScore - soloResult.priorityScore).toBe(2);
    });

    it("calculates complexity from features weighted correctly", () => {
      const withHighComplexity: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website", // Base: 2
        features: ["payment-processing", "user-accounts"], // 2.5 + 2.0 = 4.5 points
        existingAssets: "no-brand", // +1 modifier
      };

      const result = getRecommendation(withHighComplexity);

      // Base 2 + features 2 (4.5 scaled) + brand 1 = 5, capped at 4
      expect(result.scores.complexity).toBe(4); // Capped at max
    });
  });

  describe("Solution Type Determination", () => {
    it("recommends landing page for simple-landing scope", () => {
      const answers: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "flexible",
        projectScope: "simple-landing",
      };

      const result = getRecommendation(answers);

      expect(result.solutionType).toBe("landing");
      expect(result.solutionName).toBe("Lead Generation Landing Page");
    });

    it("recommends website for full-website scope", () => {
      const answers: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
      };

      const result = getRecommendation(answers);

      expect(result.solutionType).toBe("website");
      expect(result.solutionName).toBe("Professional Website");
    });

    it("recommends app for custom-app scope", () => {
      const answers: QuizAnswers = {
        investment: "premium",
        timeline: "urgent",
        projectScope: "custom-app",
      };

      const result = getRecommendation(answers);

      expect(result.solutionType).toBe("app");
      expect(result.solutionName).toBe("Custom Web Application");
    });

    it("recommends ecommerce for ecommerce-store scope", () => {
      const answers: QuizAnswers = {
        investment: "premium",
        timeline: "normal",
        projectScope: "ecommerce-store",
      };

      const result = getRecommendation(answers);

      expect(result.solutionType).toBe("ecommerce");
      expect(result.solutionName).toBe("E-commerce Solution");
    });

    it("defaults to website for not-sure scope", () => {
      const answers: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "not-sure",
      };

      const result = getRecommendation(answers);

      expect(result.solutionType).toBe("website");
    });
  });

  describe("Timeline Estimation", () => {
    it("provides correct timeline for landing page", () => {
      const answers: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "normal",
        projectScope: "simple-landing",
      };

      const result = getRecommendation(answers);

      expect(result.timeline).toBe("3-4 weeks");
    });

    it("provides correct timeline for website", () => {
      const answers: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
      };

      const result = getRecommendation(answers);

      expect(result.timeline).toBe("6-10 weeks");
    });

    it("provides correct timeline for app", () => {
      const answers: QuizAnswers = {
        investment: "premium",
        timeline: "normal",
        projectScope: "custom-app",
      };

      const result = getRecommendation(answers);

      expect(result.timeline).toBe("12-20 weeks");
    });

    it("reduces timeline by ~25% for urgent projects", () => {
      const normal: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
      };

      const urgent: QuizAnswers = {
        investment: "standard",
        timeline: "urgent",
        projectScope: "full-website",
      };

      const normalResult = getRecommendation(normal);
      const urgentResult = getRecommendation(urgent);

      // Normal: 6-10 weeks, Urgent: 5-8 weeks (actual 25% reduction with rounding)
      expect(normalResult.timeline).toBe("6-10 weeks");
      expect(urgentResult.timeline).toBe("5-8 weeks");
    });
  });

  describe("Includes List Generation", () => {
    it("includes page count for landing page", () => {
      const answers: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "flexible",
        projectScope: "simple-landing",
      };

      const result = getRecommendation(answers);

      expect(result.includes).toContain("1-3 high-converting pages");
      expect(result.includes).toContain("Mobile responsive across all devices");
    });

    it("includes selected features in includes list", () => {
      const answers: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        features: ["cms", "booking-scheduling", "analytics"],
      };

      const result = getRecommendation(answers);

      expect(result.includes).toContain("Easy content management system");
      expect(result.includes).toContain("Appointment booking system");
      expect(result.includes).toContain("Analytics dashboard & tracking");
    });

    it("always includes SEO optimization", () => {
      const answers: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "flexible",
        projectScope: "simple-landing",
        features: [],
      };

      const result = getRecommendation(answers);

      expect(result.includes).toContain("SEO optimization");
    });
  });

  describe("Edge Cases", () => {
    it("handles missing optional fields gracefully", () => {
      const minimalAnswers: QuizAnswers = {
        investment: "standard",
        timeline: "normal",
        projectScope: "full-website",
        // No features, companySize, decisionMaker, etc.
      };

      expect(() => getRecommendation(minimalAnswers)).not.toThrow();
      const result = getRecommendation(minimalAnswers);
      expect(result.priorityScore).toBeGreaterThan(0);
    });

    it("handles need-guidance investment correctly", () => {
      const answers: QuizAnswers = {
        investment: "need-guidance", // Should treat as standard (score: 2)
        timeline: "normal",
        projectScope: "full-website",
      };

      const result = getRecommendation(answers);

      expect(result.scores.budget).toBe(2);
      expect(result.investmentRange).toContain("$1,350"); // 1500 * 0.9
    });

    it("handles premium-budget investment correctly", () => {
      const answers: QuizAnswers = {
        investment: "premium-budget", // Should have highest budget score (4)
        timeline: "normal",
        projectScope: "custom-app",
      };

      const result = getRecommendation(answers);

      expect(result.scores.budget).toBe(4);
      expect(result.investmentRange).toBe("$7,200+"); // 8000 * 0.9
    });

    it("caps complexity score at 4", () => {
      const maxComplexity: QuizAnswers = {
        investment: "premium",
        timeline: "urgent",
        projectScope: "custom-app", // Base: 4
        features: ["payment-processing", "user-accounts", "booking-scheduling", "integrations"], // Lots of features
        existingAssets: "no-brand", // +1
      };

      const result = getRecommendation(maxComplexity);

      expect(result.scores.complexity).toBeLessThanOrEqual(4);
      expect(result.scores.complexity).toBeGreaterThanOrEqual(1);
    });

    it("floors complexity score at 1", () => {
      const minComplexity: QuizAnswers = {
        investment: "budget-conscious",
        timeline: "flexible",
        projectScope: "simple-landing", // Base: 1
        features: [], // No features
        existingAssets: "full-brand", // No penalty
      };

      const result = getRecommendation(minComplexity);

      expect(result.scores.complexity).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Budget Score Ranges", () => {
    it("assigns correct scores for all budget levels", () => {
      const budgetLevels = [
        { investment: "budget-conscious", expectedScore: 1 },
        { investment: "standard", expectedScore: 2 },
        { investment: "need-guidance", expectedScore: 2 },
        { investment: "premium", expectedScore: 3 },
        { investment: "enterprise", expectedScore: 4 },
        { investment: "premium-budget", expectedScore: 4 },
      ] as const;

      budgetLevels.forEach(({ investment, expectedScore }) => {
        const result = getRecommendation({
          investment,
          timeline: "normal",
          projectScope: "full-website",
        });

        expect(result.scores.budget).toBe(expectedScore);
      });
    });
  });

  describe("Urgency Score Ranges", () => {
    it("assigns correct scores for all timeline levels", () => {
      const timelineLevels = [
        { timeline: "flexible", expectedScore: 1 },
        { timeline: "planning", expectedScore: 2 },
        { timeline: "normal", expectedScore: 3 },
        { timeline: "urgent", expectedScore: 4 },
      ] as const;

      timelineLevels.forEach(({ timeline, expectedScore }) => {
        const result = getRecommendation({
          investment: "standard",
          timeline,
          projectScope: "full-website",
        });

        expect(result.scores.urgency).toBe(expectedScore);
      });
    });
  });

  describe("Real-World Scenarios", () => {
    it("correctly prioritizes SaaS startup founder with urgent needs", () => {
      const saasFounder: QuizAnswers = {
        currentSituation: "startup",
        industry: "technology",
        businessGoal: ["scale-business", "more-customers"],
        targetAudience: "B2B",
        features: ["user-accounts", "payment-processing", "api"],
        projectScope: "custom-app",
        existingAssets: "partial-brand",
        timeline: "urgent",
        investment: "premium",
        companySize: "2-10",
        decisionMaker: "owner",
      };

      const result = getRecommendation(saasFounder);

      expect(result.priorityScore).toBeGreaterThanOrEqual(32);
      expect(result.solutionType).toBe("app");
      expect(getPriorityLabel(result.priorityScore)).toBe("🔥 HIGH PRIORITY");
    });

    it("correctly handles local business wanting simple presence", () => {
      const localBusiness: QuizAnswers = {
        currentSituation: "existing-business",
        industry: "home-services",
        businessGoal: ["improve-credibility"],
        features: ["contact-forms"],
        projectScope: "simple-landing",
        existingAssets: "full-brand",
        timeline: "flexible",
        investment: "budget-conscious",
        companySize: "solo",
        decisionMaker: "owner",
      };

      const result = getRecommendation(localBusiness);

      expect(result.priorityScore).toBeLessThan(24);
      expect(result.solutionType).toBe("landing");
      expect(result.investmentRange).toContain("$675"); // 750 * 0.9
    });

    it("correctly handles enterprise e-commerce project", () => {
      const ecommerce: QuizAnswers = {
        currentSituation: "established",
        industry: "retail-ecommerce",
        businessGoal: ["scale-business", "reduce-costs"],
        features: ["payment-processing", "user-accounts", "cms", "analytics"],
        projectScope: "ecommerce-store",
        existingAssets: "partial-brand",
        timeline: "normal",
        investment: "enterprise",
        companySize: "51-200",
        decisionMaker: "executive",
      };

      const result = getRecommendation(ecommerce);

      expect(result.priorityScore).toBeGreaterThanOrEqual(32);
      expect(result.solutionType).toBe("ecommerce");
      expect(result.timeline).toBe("10-16 weeks");
    });
  });
});
