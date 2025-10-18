/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals and sends them to backend for analysis.
 * Metrics tracked: LCP, CLS, TTFB, INP
 */

import { onCLS, onLCP, onTTFB, onINP, type Metric } from "web-vitals";

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
  pathname: string;
  timestamp: number;
}

/**
 * Send metric to backend
 */
async function sendMetric(metric: Metric) {
  try {
    const data: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      pathname: window.location.pathname,
      timestamp: Date.now(),
    };

    // Send to backend API
    await fetch("/api/vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      // Use keepalive to ensure metric is sent even if page unloads
      keepalive: true,
    }).catch(() => {
      // Fail silently - don't break the app if metrics fail to send
    });

    // Optionally send to Google Analytics if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        event_category: "Web Vitals",
      });
    }
  } catch (error) {
    // Silently fail - monitoring should never break the app
    console.debug("Failed to send performance metric:", error);
  }
}

/**
 * Initialize performance monitoring
 * Call this once when the app loads
 */
export function initPerformanceMonitoring() {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Track all Core Web Vitals
  onCLS(sendMetric); // Cumulative Layout Shift
  onLCP(sendMetric); // Largest Contentful Paint
  onTTFB(sendMetric); // Time to First Byte
  onINP(sendMetric); // Interaction to Next Paint (measures responsiveness)

  console.debug("Performance monitoring initialized");
}

/**
 * Get performance rating label for display
 */
export function getPerformanceRatingLabel(rating: "good" | "needs-improvement" | "poor"): string {
  const labels = {
    good: "✅ Good",
    "needs-improvement": "⚠️ Needs Improvement",
    poor: "❌ Poor",
  };
  return labels[rating];
}
