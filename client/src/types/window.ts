/**
 * Window Object Type Extensions
 */

export interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

export interface WindowWithDataLayer extends Window {
  dataLayer?: unknown[];
}

export interface CustomEventMap {
  calculatorUpdated: CustomEvent<import("./calculator").CalculatorData>;
  startQuiz: Event;
}

declare global {
  interface Window extends WindowWithGtag, WindowWithDataLayer {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ): void;

    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
  }
}
