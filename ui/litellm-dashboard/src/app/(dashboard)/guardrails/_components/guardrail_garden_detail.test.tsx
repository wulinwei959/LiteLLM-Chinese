import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { describe, expect, it, vi } from "vitest";
import GuardrailDetailView from "./guardrail_garden_detail";
import type { GuardrailCardInfo } from "./guardrail_garden_data";

vi.mock("./add_guardrail_form", () => ({ default: () => null }));

const makeCard = (overrides: Partial<GuardrailCardInfo> = {}): GuardrailCardInfo => ({
  id: "bedrock",
  name: "Bedrock Guardrail",
  description: "AWS Bedrock Guardrails for content filtering.",
  category: "partner",
  logo: "/_next/static/media/bedrock.svg",
  tags: ["AWS"],
  ...overrides,
});

const renderDetail = (card: GuardrailCardInfo) =>
  renderWithProviders(
    <GuardrailDetailView card={card} onBack={vi.fn()} accessToken={null} onGuardrailCreated={vi.fn()} />,
  );

describe("GuardrailDetailView logo", () => {
  it("renders the card logo through the shared Logo component with the bundled src", () => {
    renderDetail(makeCard());
    expect(screen.getByAltText("Bedrock Guardrail logo")).toHaveAttribute("src", "/_next/static/media/bedrock.svg");
  });

  it("falls back to a letter avatar when the card has no logo", () => {
    renderDetail(makeCard({ logo: "" }));
    expect(screen.queryByAltText("Bedrock Guardrail logo")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});

describe("GuardrailDetailView decision model card", () => {
  it("renders the catalog description over the raw card text for known card ids", () => {
    renderDetail(
      makeCard({
        id: "dm_perplexity",
        description: "Perplexity's pplx-decider model answers your yes/no questions about each request or response.",
      }),
    );
    expect(
      screen.getAllByText("Perplexity 的 pplx-decider 模型会针对每个请求或响应回答你是或非的问题。").length,
    ).toBeGreaterThan(0);
  });

  it("labels a decision model card as a billed Decision Model guardrail", () => {
    renderDetail(makeCard({ id: "dm_perplexity", name: "Perplexity Decision", category: "decision_model" }));

    expect(screen.getByRole("row", { name: "提供商 决策模型" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: "费用 由决策模型提供商按每次调用计费" })).toBeInTheDocument();
    expect(screen.getAllByText("决策模型")).toHaveLength(2);
  });

  it("keeps the partner labels and no cost row on a partner card", () => {
    renderDetail(makeCard());

    expect(screen.getByRole("row", { name: "提供商 合作伙伴护栏" })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /^费用/ })).not.toBeInTheDocument();
    expect(screen.getByText("合作伙伴")).toBeInTheDocument();
  });
});
