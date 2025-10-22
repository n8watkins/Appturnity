/**
 * reCAPTCHA Utility Functions
 *
 * SIMPLIFIED wrapper that always returns a token (never throws or rejects).
 * Removed Promise.race and timeout logic that was causing unhandled rejections.
 */

/**
 * Safely execute reCAPTCHA and guarantee a string result (never null/undefined)
 *
 * This function:
 * 1. Never rejects - always returns a token string
 * 2. Returns fallback tokens if reCAPTCHA fails
 * 3. Simple try-catch, no complex Promise.race logic
 *
 * @param executeRecaptcha - The executeRecaptcha function from useGoogleReCaptcha hook
 * @param action - The action name for reCAPTCHA (e.g., "contact_form", "newsletter")
 * @param timeoutMs - Kept for backwards compatibility but not used
 * @returns Promise that always resolves to a string token (never rejects)
 */
export async function safeExecuteRecaptcha(
  executeRecaptcha: ((action: string) => Promise<string>) | undefined,
  action: string,
  _timeoutMs?: number // Keep for backwards compatibility but don't use
): Promise<string> {
  // In dev, just return a test token immediately
  if (import.meta.env.DEV) {
    return `test_token_${action}`;
  }

  // In production, try to execute with minimal error handling
  if (!executeRecaptcha) {
    return "fallback_no_recaptcha";
  }

  try {
    const token = await executeRecaptcha(action);
    return token || "fallback_empty_token";
  } catch {
    return "fallback_error_token";
  }
}

/**
 * Hook-friendly version that returns both the execute function and a loading state
 *
 * Usage:
 * ```typescript
 * const { executeRecaptcha } = useGoogleReCaptcha();
 * const safeExecute = useSafeRecaptcha(executeRecaptcha);
 *
 * // In your submit handler:
 * const token = await safeExecute("contact_form");
 * ```
 */
export function createSafeRecaptchaExecutor(
  executeRecaptcha: ((action: string) => Promise<string>) | undefined
) {
  return (action: string, timeoutMs?: number) =>
    safeExecuteRecaptcha(executeRecaptcha, action, timeoutMs);
}

/**
 * Check if reCAPTCHA is ready (executeRecaptcha is available)
 */
export function isRecaptchaReady(
  executeRecaptcha: ((action: string) => Promise<string>) | undefined
): boolean {
  return executeRecaptcha !== undefined;
}
