/**
 * Contact Form Type Definitions
 */

import { CalculatorData } from "./calculator";
import { QuizResult } from "./quiz";

export type ProjectSource = "calculator" | "quiz" | "manual";

export interface ProjectDetails {
  source: ProjectSource;
  data: CalculatorData | QuizResult;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  recaptchaToken: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}
