/**
 * Custom test utilities and render functions
 */

import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

/**
 * Creates a new QueryClient for testing with default configuration
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  withReCaptcha?: boolean;
}

/**
 * Custom render function that wraps components with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    withReCaptcha = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    let content = <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

    if (withReCaptcha) {
      content = (
        <GoogleReCaptchaProvider reCaptchaKey="test-key">{content}</GoogleReCaptchaProvider>
      );
    }

    return content;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { renderWithProviders as render };
