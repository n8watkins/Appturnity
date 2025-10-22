/**
 * reCAPTCHA Utility Functions
 *
 * Safe wrapper around react-google-recaptcha-v3 to prevent null/undefined promise rejections.
 * Handles edge cases like:
 * - Component unmounting before promise resolves
 * - reCAPTCHA script failing to load
 * - Network timeouts
 * - Rate limiting
 */

/**
 * Safely execute reCAPTCHA and guarantee a string result (never null/undefined)
 *
 * This function:
 * 1. Never rejects with null/undefined (prevents unhandled rejection warnings)
 * 2. Has built-in timeout protection (1 second default)
 * 3. Returns a fallback token in dev mode if reCAPTCHA fails
 * 4. Throws descriptive errors in production mode for debugging
 *
 * @param executeRecaptcha - The executeRecaptcha function from useGoogleReCaptcha hook
 * @param action - The action name for reCAPTCHA (e.g., "contact_form", "newsletter")
 * @param timeoutMs - Timeout in milliseconds (default: 1000ms)
 * @returns Promise that always resolves to a string token
 * @throws Error in production if reCAPTCHA fails (never null/undefined)
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
    // Race between reCAPTCHA execution and timeout
    const token = await Promise.race<string>([
      // Main reCAPTCHA execution with null/undefined protection
      (async () => {
        try {
          const result = await executeRecaptcha(action);

          // Ensure we never return null/undefined
          if (result === null || result === undefined || result === "") {
            throw new Error("reCAPTCHA returned null/undefined/empty");
          }

          return result;
        } catch (err) {
          // Catch and re-throw with better error message
          // This prevents null/undefined rejections from propagating
          const errorMessage = err instanceof Error ? err.message : String(err);
          throw new Error(`reCAPTCHA execution failed: ${errorMessage}`);
        }
      })(),

      // Timeout fallback
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("reCAPTCHA timeout")), timeoutMs)
      ),
    ]);

    return token;
  } catch (error) {
    // At this point, we know the error is not null/undefined
    // because we wrapped everything above

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (import.meta.env.DEV) {
      console.warn(`[reCAPTCHA] Execution failed: ${errorMessage}, using dev fallback token`);
      return `dev_token_${action}_${Date.now()}`;
    }

    // In production, throw a proper Error (never null/undefined)
    throw new Error(`reCAPTCHA failed: ${errorMessage}`);
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
