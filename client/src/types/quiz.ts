/**
 * Service Quiz Type Definitions
 */

export interface QuizAnswer {
  id: string;
  text: string;
  score?: number;
  next?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  description?: string;
  answers: QuizAnswer[];
  errorInfo?: ErrorInfo;
}

export interface ErrorInfo {
  message: string;
  componentStack: string;
}

export interface QuizResult {
  answers: Record<number, string>;
  score: number;
  recommendation: QuizRecommendation;
  completedAt: string;
}

export interface QuizRecommendation {
  tier: "Starter" | "Professional" | "Enterprise";
  title: string;
  description: string;
  features: string[];
  estimatedPrice: number;
  timeline: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  isComplete: boolean;
  result?: QuizRecommendation;
}
