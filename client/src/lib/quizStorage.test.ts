import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveQuizResults,
  getQuizResults,
  clearQuizResults,
  hasValidQuizResults,
} from "./quizStorage";

describe("Quiz Storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Basic Operations", () => {
    it("saves and retrieves quiz results", () => {
      const results = {
        investment: "premium",
        timeline: "urgent",
        projectScope: "custom-app",
      };

      saveQuizResults(results);
      const retrieved = getQuizResults();

      expect(retrieved).toEqual(results);
    });

    it("returns null when no quiz results are stored", () => {
      const retrieved = getQuizResults();
      expect(retrieved).toBeNull();
    });

    it("clears quiz results successfully", () => {
      const results = { investment: "standard" };
      saveQuizResults(results);

      expect(getQuizResults()).toEqual(results);

      clearQuizResults();
      expect(getQuizResults()).toBeNull();
    });

    it("hasValidQuizResults returns true when results exist", () => {
      const results = { investment: "premium" };
      saveQuizResults(results);

      expect(hasValidQuizResults()).toBe(true);
    });

    it("hasValidQuizResults returns false when results don't exist", () => {
      expect(hasValidQuizResults()).toBe(false);
    });
  });

  describe("Expiration Handling", () => {
    it("returns null for expired results after 15 minutes", () => {
      const results = { investment: "premium" };
      saveQuizResults(results);

      // Fast-forward time by 16 minutes
      vi.useFakeTimers();
      vi.advanceTimersByTime(16 * 60 * 1000);

      const retrieved = getQuizResults();
      expect(retrieved).toBeNull();

      vi.useRealTimers();
    });

    it("returns results before expiration (14 minutes)", () => {
      const results = { investment: "premium" };
      saveQuizResults(results);

      // Fast-forward time by 14 minutes
      vi.useFakeTimers();
      vi.advanceTimersByTime(14 * 60 * 1000);

      const retrieved = getQuizResults();
      expect(retrieved).toEqual(results);

      vi.useRealTimers();
    });

    it("clears expired results from localStorage", () => {
      const results = { investment: "premium" };
      saveQuizResults(results);

      // Verify it's stored
      expect(localStorage.getItem("quizResults")).not.toBeNull();

      // Fast-forward time
      vi.useFakeTimers();
      vi.advanceTimersByTime(16 * 60 * 1000);

      // Retrieve (which should clear expired data)
      getQuizResults();

      // Verify it's been removed
      expect(localStorage.getItem("quizResults")).toBeNull();

      vi.useRealTimers();
    });
  });

  describe("Error Handling", () => {
    it("handles corrupted JSON data gracefully", () => {
      // Manually set invalid JSON
      localStorage.setItem("quizResults", "{ invalid json }");

      const retrieved = getQuizResults();
      expect(retrieved).toBeNull();

      // Should have cleared the corrupted data
      expect(localStorage.getItem("quizResults")).toBeNull();
    });

    it("handles localStorage disabled (private browsing)", () => {
      // Mock getItem to throw (simulating disabled localStorage)
      const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("localStorage is disabled");
      });

      // Should not throw
      const retrieved = getQuizResults();
      expect(retrieved).toBeNull();

      getItemSpy.mockRestore();
    });
  });
});
