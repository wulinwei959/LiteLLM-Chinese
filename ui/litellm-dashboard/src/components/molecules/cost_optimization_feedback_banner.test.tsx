import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../../tests/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import CostOptimizationFeedbackBanner from "./cost_optimization_feedback_banner";

const STORAGE_KEY = "hideCostOptimizationFeedbackBanner";

describe("CostOptimizationFeedbackBanner", () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it("renders with a link to the feedback discussion", () => {
    render(<CostOptimizationFeedbackBanner />);
    const link = screen.getByText("分享反馈").closest("a");
    expect(link).toHaveAttribute("href", "https://github.com/BerriAI/litellm/discussions/32172");
  });

  it("hides itself and persists the dismissal when the dismiss button is clicked", () => {
    render(<CostOptimizationFeedbackBanner />);
    expect(screen.getByText("帮助改进成本优化")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("关闭横幅"));

    expect(screen.queryByText("帮助改进成本优化")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
  });

  it("stays dismissed on remount once persisted", () => {
    localStorage.setItem(STORAGE_KEY, "true");
    render(<CostOptimizationFeedbackBanner />);
    expect(screen.queryByText("帮助改进成本优化")).not.toBeInTheDocument();
  });
});
