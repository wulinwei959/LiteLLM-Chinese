import { screen, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { DailyData, SpendMetrics } from "@/components/UsagePage/types";
import UsageBreakdownChart from "./UsageBreakdownChart";

const metrics: SpendMetrics = {
  spend: 9,
  total_tokens: 800,
  prompt_tokens: 600,
  completion_tokens: 200,
  api_requests: 3,
  successful_requests: 3,
  failed_requests: 0,
  cache_read_input_tokens: 0,
  cache_creation_input_tokens: 0,
};
const results: DailyData[] = [
  {
    date: "2026-10-01",
    metrics,
    breakdown: {
      model_groups: { "claude-sonnet-4": { metrics, metadata: {}, api_key_breakdown: {} } },
      models: {},
      mcp_servers: {},
      providers: {},
      api_keys: {},
      entities: {},
    },
  },
];

describe("UsageBreakdownChart", () => {
  it("should render the current Usage chart controls and model leaderboard", () => {
    render(<UsageBreakdownChart results={results} loading={false} />);

    expect(screen.getByRole("heading", { name: "按日用量" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "热门模型" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "花费" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "按日" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "线性" })).toBeChecked();
    expect(screen.getByText("claude-sonnet-4")).toBeInTheDocument();
    expect(within(screen.getByRole("listitem")).getByText("$9.00")).toBeInTheDocument();
  });

  it("should keep metric, time bucket and scale controls working in the compact panel", async () => {
    const user = userEvent.setup();
    const deploymentResults = results.map((day) => ({
      ...day,
      breakdown: { ...day.breakdown, model_groups: {}, models: day.breakdown.model_groups },
    }));
    render(<UsageBreakdownChart results={deploymentResults} loading={false} compact dimension="models" />);

    expect(screen.getByText("claude-sonnet-4")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "令牌" }));
    expect(screen.getByText("按日令牌，按模型（前 8 名，其余归入其他）")).toBeInTheDocument();
    expect(within(screen.getByRole("listitem")).getByText("800")).toBeInTheDocument();
    expect(screen.queryByText("$9.00")).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "按周" }));
    expect(screen.getByRole("heading", { name: "按周用量" })).toBeInTheDocument();
    expect(screen.getByText("按周令牌，按模型（前 8 名，其余归入其他）")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "对数" }));
    expect(screen.getByRole("radio", { name: "对数" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "请求" }));
    expect(screen.getByText("按周请求，按模型（前 8 名，其余归入其他）")).toBeInTheDocument();
    expect(within(screen.getByRole("listitem")).getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("800")).not.toBeInTheDocument();
  });

  it("should show loading rather than an empty leaderboard until the data has settled", () => {
    render(<UsageBreakdownChart results={[]} loading compact />);

    expect(screen.getByRole("status", { name: "正在加载热门模型" })).toBeInTheDocument();
    expect(screen.queryByText("No usage in this range")).not.toBeInTheDocument();
  });
});
