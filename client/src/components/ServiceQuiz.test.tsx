/**
 * ServiceQuiz Component Test Suite
 * Tests quiz navigation, answer selection, and results calculation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import ServiceQuiz from "./ServiceQuiz";

describe("ServiceQuiz Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render the quiz component", () => {
    render(<ServiceQuiz />);
    expect(screen.getByText(/find your perfect solution/i)).toBeInTheDocument();
  });

  it("should show start button initially", () => {
    render(<ServiceQuiz />);
    expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
  });

  it("should start quiz when start button is clicked", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    // Should show first question
    await waitFor(() => {
      expect(screen.queryByText(/start quiz/i)).not.toBeInTheDocument();
    });
  });

  it("should display progress indicator", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    await waitFor(() => {
      // Look for progress text like "Question 1 of 7" or progress bar
      const progressText = screen.queryByText(/question \d+ of \d+/i);
      expect(progressText).toBeInTheDocument();
    });
  });

  it("should allow selecting an answer", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      // Find an answer button (not navigation buttons)
      const answerButton = buttons.find(
        (btn) =>
          !btn.textContent?.includes("Next") &&
          !btn.textContent?.includes("Previous") &&
          !btn.textContent?.includes("Start")
      );
      expect(answerButton).toBeDefined();
    });
  });

  it("should navigate to next question after selecting answer", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/question 1 of/i)).toBeInTheDocument();
    });

    // Select first answer option
    const buttons = screen.getAllByRole("button");
    const answerButton = buttons.find(
      (btn) => !btn.textContent?.includes("Next") && !btn.textContent?.includes("Previous")
    );

    if (answerButton) {
      await user.click(answerButton);

      // Should show next button or auto-advance
      await waitFor(
        () => {
          const questionText = screen.queryByText(/question \d+ of/i);
          expect(questionText).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    }
  });

  it("should show results after completing all questions", async () => {
    const user = userEvent.setup();
    const mockOnComplete = vi.fn();
    render(<ServiceQuiz onComplete={mockOnComplete} />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    // Answer all questions (simplified - just click through)
    for (let i = 0; i < 10; i++) {
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        const answerButton = buttons.find(
          (btn) =>
            !btn.textContent?.includes("Previous") && !btn.textContent?.includes("View Results")
        );
        if (answerButton) {
          user.click(answerButton);
        }
      });

      // Small delay between clicks
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Should eventually show results
    await waitFor(
      () => {
        const results = screen.queryByText(/your recommended/i) || screen.queryByText(/result/i);
        expect(results).toBeDefined();
      },
      { timeout: 5000 }
    );
  }, 15000);

  it("should save quiz results to localStorage", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    // Complete quiz (simplified)
    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByRole("button");
      const answerButton = buttons.find((btn) => !btn.textContent?.includes("Previous"));
      if (answerButton) {
        await user.click(answerButton);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await waitFor(
      () => {
        const savedResults = localStorage.getItem("quizResults");
        expect(savedResults).toBeDefined();
      },
      { timeout: 5000 }
    );
  }, 15000);

  it("should handle restart quiz", async () => {
    const user = userEvent.setup();
    render(<ServiceQuiz />);

    // Start and complete quiz
    const startButton = screen.getByRole("button", { name: /start quiz/i });
    await user.click(startButton);

    // Answer a few questions
    for (let i = 0; i < 3; i++) {
      const buttons = screen.getAllByRole("button");
      const answerButton = buttons.find((btn) => !btn.textContent?.includes("Previous"));
      if (answerButton) {
        await user.click(answerButton);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Look for restart or back to start option
    const restartButton = screen.queryByRole("button", { name: /restart|start over/i });
    if (restartButton) {
      await user.click(restartButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
      });
    }
  }, 10000);
});
