/**
 * Window Object Type Extensions
 */

export interface CustomEventMap {
  calculatorUpdated: CustomEvent<import("./calculator").CalculatorData>;
  startQuiz: Event;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];

    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ): void;

    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
  }
}
