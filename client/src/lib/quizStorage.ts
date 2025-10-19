/**
 * Utility functions for managing quiz results with expiration
 */

import { z } from "zod";

const QUIZ_RESULTS_KEY = "quizResults";
const QUIZ_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

interface QuizStorageData {
  results: Record<string, string | string[]>;
  timestamp: number;
  expiresAt: number;
}

// Zod schema for validating localStorage data
const quizStorageSchema = z.object({
  results: z.record(z.union([z.string(), z.array(z.string())])),
  timestamp: z.number(),
  expiresAt: z.number(),
});

/**
 * Get quiz results from localStorage, checking for expiration
 * Returns null if expired or not found
 */
export function getQuizResults(): Record<string, string | string[]> | null {
  try {
    const stored = localStorage.getItem(QUIZ_RESULTS_KEY);
    if (!stored) return null;

    // Parse and validate the data structure
    const parsed = JSON.parse(stored);
    const validationResult = quizStorageSchema.safeParse(parsed);

    if (!validationResult.success) {
      console.debug("Invalid quiz data format, clearing...", validationResult.error);
      localStorage.removeItem(QUIZ_RESULTS_KEY);
      return null;
    }

    const data = validationResult.data;

    // Check if expired
    if (Date.now() > data.expiresAt) {
      console.debug("Quiz results expired, clearing...");
      localStorage.removeItem(QUIZ_RESULTS_KEY);
      return null;
    }

    return data.results;
  } catch (error) {
    console.debug("Error reading quiz results:", error);
    localStorage.removeItem(QUIZ_RESULTS_KEY);
    return null;
  }
}

/**
 * Save quiz results to localStorage with expiration
 */
export function saveQuizResults(results: Record<string, string | string[]>): void {
  const quizData: QuizStorageData = {
    results,
    timestamp: Date.now(),
    expiresAt: Date.now() + QUIZ_EXPIRATION_MS,
  };
  localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(quizData));
}

/**
 * Clear quiz results from localStorage
 */
export function clearQuizResults(): void {
  localStorage.removeItem(QUIZ_RESULTS_KEY);
}

/**
 * Check if quiz results exist and are valid (not expired)
 */
export function hasValidQuizResults(): boolean {
  return getQuizResults() !== null;
}
