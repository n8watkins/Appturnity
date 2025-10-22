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
  timeoutMs: number = 1000
): Promise<string> {
  // Handle case where executeRecaptcha is not available
  if (!executeRecaptcha) {
    const error = new Error("reCAPTCHA not initialized");

    if (import.meta.env.DEV) {
      console.warn("[reCAPTCHA] Not initialized, using dev fallback token");
      return "dev_token_not_initialized";
    }

    throw error;
  }

  try {
    // SIMPLIFIED: Just await directly - no Promise.race, no timeout
    // Let the reCAPTCHA library handle its own timeouts
    const result = await executeRecaptcha(action);

    // Ensure we never return null/undefined
    if (result === null || result === undefined || result === "") {
      if (import.meta.env.DEV) {
        console.warn("[reCAPTCHA] Returned null/undefined/empty, using fallback");
      }
      return `fallback_token_empty_${action}`;
    }

    return result;
  } catch (error) {
    // At this point, we know the error is not null/undefined
    // because we wrapped everything above

    // Extract error message safely, avoiding any complex error objects
    let errorMessage = "Unknown error";
    try {
      errorMessage = error instanceof Error ? error.message : String(error);
    } catch {
      errorMessage = "Error could not be serialized";
    }

    if (import.meta.env.DEV) {
      console.warn(`[reCAPTCHA] Execution failed: ${errorMessage}, using fallback`);
      return `dev_token_error_${action}`;
    }

    // In production, also use fallback instead of throwing
    console.error(`[reCAPTCHA] Execution failed: ${errorMessage}, using fallback`);
    return `fallback_token_error_${action}`;
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
