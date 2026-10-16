import { screen, renderWithProviders } from "../../../../tests/test-utils";
import { describe, expect, it } from "vitest";

import { SpendBudgetCell } from "./spend_budget_cell";

const indicator = (container: HTMLElement) => container.querySelector('[data-slot="meter-indicator"]');

describe("SpendBudgetCell", () => {
  it("shows Unlimited and renders no meter when there is no budget", () => {
    const { container } = renderWithProviders(<SpendBudgetCell spend={0.5} maxBudget={null} />);
    expect(screen.getByText("· 无限制")).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(indicator(container)).toBeNull();
  });

  it("shows $0.00 for zero or undefined spend, never a hyphen", () => {
    const { rerender } = renderWithProviders(<SpendBudgetCell spend={0} maxBudget={100} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
    rerender(<SpendBudgetCell spend={null} maxBudget={null} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("renders a meter carrying the spend and budget when a budget exists", () => {
    renderWithProviders(<SpendBudgetCell spend={25} maxBudget={100} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "25");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("共 $100")).toBeInTheDocument();
  });

  it("supports matching spend and budget precision for summary views", () => {
    renderWithProviders(<SpendBudgetCell spend={98.854} maxBudget={3000} spendDecimals={2} budgetDecimals={2} />);

    expect(screen.getByText("$98.85")).toBeInTheDocument();
    expect(screen.getByText("共 $3,000.00")).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuetext", "$98.85 共 $3,000.00");
  });

  it("keeps the default tone below 80% usage", () => {
    const { container } = renderWithProviders(<SpendBudgetCell spend={50} maxBudget={100} />);
    expect(indicator(container)?.className).toContain("bg-primary");
  });

  it("switches to the warning tone at 80% usage", () => {
    const { container } = renderWithProviders(<SpendBudgetCell spend={80} maxBudget={100} />);
    expect(indicator(container)?.className).toContain("bg-warning");
  });

  it("switches to the over tone above 100% usage", () => {
    const { container } = renderWithProviders(<SpendBudgetCell spend={150} maxBudget={100} />);
    expect(indicator(container)?.className).toContain("bg-destructive");
  });

  it("never meters key spend against an inherited team/org budget", () => {
    const gates = [{ scope: "Team" as const, alias: "Team A", maxBudget: 200, budgetDuration: "30d" }];
    renderWithProviders(<SpendBudgetCell spend={10} maxBudget={null} inheritedGates={gates} />);
    expect(screen.getByText("· 无限制")).toBeInTheDocument();
    expect(screen.queryByText(/\(Team\)/)).not.toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByLabelText("question-circle")).toBeInTheDocument();
  });

  it("shows no inherited-budget hint when there is nothing to inherit", () => {
    renderWithProviders(<SpendBudgetCell spend={10} maxBudget={null} inheritedGates={[]} />);
    expect(screen.queryByLabelText("question-circle")).not.toBeInTheDocument();
  });

  it("shows no inherited-budget hint when the key has its own budget", () => {
    const gates = [{ scope: "Team" as const, alias: "Team A", maxBudget: 200, budgetDuration: null }];
    renderWithProviders(<SpendBudgetCell spend={10} maxBudget={50} inheritedGates={gates} />);
    expect(screen.getByText("共 $50")).toBeInTheDocument();
    expect(screen.queryByLabelText("question-circle")).not.toBeInTheDocument();
  });
});
