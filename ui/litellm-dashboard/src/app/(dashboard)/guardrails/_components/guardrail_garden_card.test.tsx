import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import GuardrailCard from "./guardrail_garden_card";
import type { GuardrailCardInfo } from "./guardrail_garden_data";

const baseCard: GuardrailCardInfo = {
  id: "test-guard",
  name: "Test Guardrail",
  description: "A guardrail for testing purposes",
  category: "litellm",
  logo: "/logos/test.svg",
  tags: ["safety"],
};

describe("GuardrailCard", () => {
  it("should render", () => {
    renderWithProviders(<GuardrailCard card={baseCard} onClick={vi.fn()} />);
    expect(screen.getByText("Test Guardrail")).toBeInTheDocument();
  });

  it("should display the card description", () => {
    renderWithProviders(<GuardrailCard card={baseCard} onClick={vi.fn()} />);
    expect(screen.getByText("A guardrail for testing purposes")).toBeInTheDocument();
  });

  it("should call onClick when the card is clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<GuardrailCard card={baseCard} onClick={onClick} />);

    await user.click(screen.getByText("Test Guardrail"));

    expect(onClick).toHaveBeenCalled();
  });

  it("should show eval badge when card has eval data", () => {
    const cardWithEval: GuardrailCardInfo = {
      ...baseCard,
      eval: { f1: 95, precision: 92, recall: 98, testCases: 500, latency: "10ms" },
    };
    renderWithProviders(<GuardrailCard card={cardWithEval} onClick={vi.fn()} />);
    expect(screen.getByText(/F1: 95%/)).toBeInTheDocument();
    expect(screen.getByText(/500 个测试用例/)).toBeInTheDocument();
  });

  it("should not show eval badge when card has no eval data", () => {
    renderWithProviders(<GuardrailCard card={baseCard} onClick={vi.fn()} />);
    expect(screen.queryByText(/F1:/)).not.toBeInTheDocument();
  });

  it("should render the logo through the shared Logo component with the card src", () => {
    renderWithProviders(<GuardrailCard card={baseCard} onClick={vi.fn()} />);
    const img = screen.getByAltText("Test Guardrail logo");
    expect(img).toHaveAttribute("src", expect.stringContaining("/logos/test.svg"));
  });

  it("should pass a bundled static-import src through unchanged", () => {
    const bundledCard: GuardrailCardInfo = { ...baseCard, logo: "/_next/static/media/akto.svg" };
    renderWithProviders(<GuardrailCard card={bundledCard} onClick={vi.fn()} />);
    expect(screen.getByAltText("Test Guardrail logo")).toHaveAttribute("src", "/_next/static/media/akto.svg");
  });

  it("should show fallback initial when logo fails to load", () => {
    renderWithProviders(<GuardrailCard card={baseCard} onClick={vi.fn()} />);
    const img = screen.getByAltText("Test Guardrail logo");

    act(() => {
      fireEvent.error(img);
    });

    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByAltText("Test Guardrail logo")).not.toBeInTheDocument();
  });

  it("should show fallback initial when logo src is empty", () => {
    const cardNoLogo: GuardrailCardInfo = { ...baseCard, logo: "" };
    renderWithProviders(<GuardrailCard card={cardNoLogo} onClick={vi.fn()} />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
