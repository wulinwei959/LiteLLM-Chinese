import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import GuardrailGarden from "./guardrail_garden";
import { ALL_CARDS } from "./guardrail_garden_data";

vi.mock("./guardrail_garden_detail", () => ({
  __esModule: true,
  default: ({ card, onBack }: { card: { name: string }; onBack: () => void }) => (
    <div>
      <span>Detail for {card.name}</span>
      <button onClick={onBack}>Back to garden</button>
    </div>
  ),
}));

const LITELLM_CARDS = ALL_CARDS.filter((c) => c.category === "litellm");
const PARTNER_CARDS = ALL_CARDS.filter((c) => c.category === "partner");

describe("GuardrailGarden", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderGarden = () =>
    renderWithProviders(<GuardrailGarden accessToken="test-token" onGuardrailCreated={vi.fn()} />);

  it("should render both sections with their descriptions", () => {
    renderGarden();

    expect(screen.getByText("LiteLLM 内容过滤器")).toBeInTheDocument();
    expect(
      screen.getByText(
        "LiteLLM 内置护栏。零延迟，无外部依赖，无额外成本。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("合作伙伴护栏")).toBeInTheDocument();
    expect(
      screen.getByText("来自领先 AI 安全提供商的第三方护栏集成。"),
    ).toBeInTheDocument();
  });

  it("should show a capped set of litellm cards behind a show all toggle", async () => {
    const user = userEvent.setup();
    renderGarden();

    expect(screen.getByText(`显示全部（${LITELLM_CARDS.length}）`)).toBeInTheDocument();
    expect(screen.getByText(LITELLM_CARDS[0].name)).toBeInTheDocument();
    expect(screen.queryByText(LITELLM_CARDS[LITELLM_CARDS.length - 1].name)).not.toBeInTheDocument();

    await user.click(screen.getByText(`显示全部（${LITELLM_CARDS.length}）`));

    expect(screen.getByText("收起")).toBeInTheDocument();
    expect(screen.getByText(LITELLM_CARDS[LITELLM_CARDS.length - 1].name)).toBeInTheDocument();
  });

  it("should always render every partner card", () => {
    renderGarden();

    PARTNER_CARDS.forEach((card) => {
      expect(screen.getByText(card.name)).toBeInTheDocument();
    });
  });

  it("should filter cards by the search query", async () => {
    const user = userEvent.setup();
    renderGarden();

    const target = PARTNER_CARDS[0];
    await user.type(screen.getByPlaceholderText("搜索护栏"), target.name);

    expect(await screen.findByText(target.name)).toBeInTheDocument();
    const otherPartner = PARTNER_CARDS.find((c) => c.name !== target.name);
    if (otherPartner) {
      expect(screen.queryByText(otherPartner.name)).not.toBeInTheDocument();
    }
  });

  it("should show an empty result set for a query that matches nothing", async () => {
    const user = userEvent.setup();
    renderGarden();

    await user.type(screen.getByPlaceholderText("搜索护栏"), "zzzzznotaguardrailzzzzz");

    expect(screen.getByText("显示全部（0）")).toBeInTheDocument();
    PARTNER_CARDS.forEach((card) => {
      expect(screen.queryByText(card.name)).not.toBeInTheDocument();
    });
  });

  it("should open the detail view for a clicked card and return to the garden", async () => {
    const user = userEvent.setup();
    renderGarden();

    const target = PARTNER_CARDS[0];
    await user.click(screen.getByText(target.name));

    expect(await screen.findByText(`Detail for ${target.name}`)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("搜索护栏")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to garden" }));

    expect(await screen.findByPlaceholderText("搜索护栏")).toBeInTheDocument();
  });
});
