import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import DecisionModelsBanner from "./DecisionModelsBanner";
import { renderWithProviders } from "../../../tests/test-utils";

const STORAGE_KEY = "hideDecisionModelsBanner";

describe("DecisionModelsBanner", () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("hideCostOptimizationFeedbackBanner");
  });

  it("links directly to the Decisions playground", () => {
    renderWithProviders(<DecisionModelsBanner />);
    const link = screen.getByRole("link", { name: "Try decision models" });
    expect(link).toHaveAttribute("href", "/ui/playground?tab=system-one");
  });

  it("links to the docs on how to call decision models", () => {
    renderWithProviders(<DecisionModelsBanner />);
    expect(screen.getByRole("link", { name: "如何调用" })).toHaveAttribute(
      "href",
      "https://docs.litellm.ai/docs/decisions",
    );
  });

  it("links Supported providers to the provider table in the docs", () => {
    renderWithProviders(<DecisionModelsBanner />);
    expect(screen.getByRole("link", { name: "支持的提供商" })).toHaveAttribute(
      "href",
      "https://docs.litellm.ai/docs/decisions#supported-providers",
    );
    expect(screen.getByRole("paragraph")).not.toHaveTextContent("Add Model");
    expect(screen.getByRole("paragraph")).toHaveTextContent("Call them at /v1/decisions or /v1/systemone");
  });

  it("shows the announcement even if the old feedback banner was dismissed", () => {
    localStorage.setItem("hideCostOptimizationFeedbackBanner", "true");
    renderWithProviders(<DecisionModelsBanner />);
    expect(screen.getByText("现在支持决策模型了")).toBeInTheDocument();
  });

  it("hides itself and persists the dismissal when the dismiss button is clicked", () => {
    renderWithProviders(<DecisionModelsBanner />);
    expect(screen.getByText("现在支持决策模型了")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Dismiss banner"));

    expect(screen.queryByText("现在支持决策模型了")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
  });

  it("stays dismissed on remount once persisted", () => {
    localStorage.setItem(STORAGE_KEY, "true");
    renderWithProviders(<DecisionModelsBanner />);
    expect(screen.queryByText("现在支持决策模型了")).not.toBeInTheDocument();
  });
});
