import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders as render } from "../../../../../tests/test-utils";
import ModelInsightsView from "./ModelInsightsView";
import { apiClient } from "@/components/networking";

vi.mock("@/components/networking", () => ({ apiClient: { get: vi.fn() } }));
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));
vi.mock("recharts", () => ({
  Bar: () => null,
  BarChart: ({ children, data }: { children: React.ReactNode; data: { date: string }[] }) => (
    <div data-testid="usage-chart" data-first={data[0]?.date} data-buckets={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

const metrics = {
  model_group: "fast-chat",
  model: "openai/gpt-5.4-mini",
  provider: "openai",
  spend: 2.5,
  prompt_tokens: 1000,
  completion_tokens: 2000,
  requests: 12,
  successful_requests: 12,
  failed_requests: 0,
};

const response = {
  start_date: "2025-09-29",
  end_date: "2026-09-28",
  top_models: [metrics],
  daily: [{ ...metrics, date: "2026-09-28" }],
  daily_totals: [{ date: "2026-09-28", spend: 2.5, prompt_tokens: 1000, completion_tokens: 2000, requests: 12 }],
};

describe("ModelInsightsView", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.get).mockResolvedValue(response);
  });

  it("shows the ranking with share from the API response", async () => {
    render(<ModelInsightsView accessToken="token" />);

    expect(await screen.findByText("fast-chat")).toBeInTheDocument();
    expect(
      screen.getByText(`你的网关在 ${response.start_date} 至 ${response.end_date} 期间用过的模型`),
    ).toBeInTheDocument();
    expect(screen.getByText("由 openai 提供")).toBeInTheDocument();
    expect(screen.getAllByText("100.0%")).toHaveLength(1);
    expect(screen.queryByText("Top models by task")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "tokens" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "log" })).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith("/model-insights", {
      accessToken: "token",
      query: { metric: "tokens" },
    });
    expect(apiClient.get).not.toHaveBeenCalledWith("/model-insights/tasks", expect.anything());
  });

  it("renders the session cost card in Chinese", async () => {
    render(<ModelInsightsView accessToken="token" />);

    expect(await screen.findByText("每次会话成本")).toBeInTheDocument();
    expect(screen.getByText("会话成本不按请求数估算")).toBeInTheDocument();
    expect(
      screen.getByText("为请求添加稳定的 session_id，以便在未来的有界会话汇总中实现准确的会话级模型对比"),
    ).toBeInTheDocument();
  });

  it("refetches with the selected metric so top models are ranked by it", async () => {
    render(<ModelInsightsView accessToken="token" />);
    await screen.findByText("fast-chat");

    await userEvent.click(screen.getByRole("tab", { name: "requests" }));

    await waitFor(() =>
      expect(apiClient.get).toHaveBeenCalledWith("/model-insights", {
        accessToken: "token",
        query: { metric: "requests" },
      }),
    );
  });

  it("shows the API error instead of loading forever", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error("Only proxy admins can view deployment-wide model insights"));
    render(<ModelInsightsView accessToken="token" />);

    expect(await screen.findByText("无法加载模型洞察")).toBeInTheDocument();
    expect(screen.getByText("Only proxy admins can view deployment-wide model insights")).toBeInTheDocument();
  });

  it("keeps the previous ranking, dimmed, until the new metric's data arrives", async () => {
    render(<ModelInsightsView accessToken="token" />);
    await screen.findByText("fast-chat");
    let resolve: (value: typeof response) => void = () => {};
    vi.mocked(apiClient.get).mockImplementation(() => new Promise((done) => (resolve = done as typeof resolve)));

    await userEvent.click(screen.getByRole("tab", { name: "spend" }));

    expect(
      screen.getByText("令牌数的占比，以及该时段前后两半的变化"),
    ).toBeInTheDocument();

    resolve(response);
    expect(
      await screen.findByText("花费的占比，以及该时段前后两半的变化"),
    ).toBeInTheDocument();
  });

  it("charts one bar per day by default and switches to weekly bars", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...response,
      daily: [
        { ...metrics, date: response.start_date },
        { ...metrics, date: response.end_date },
      ],
    });
    render(<ModelInsightsView accessToken="token" />);
    await screen.findByText("fast-chat");
    const chart = screen.getByTestId("usage-chart");
    const days = Math.floor((Date.parse(response.end_date) - Date.parse(response.start_date)) / 86_400_000) + 1;

    expect(screen.getByRole("tab", { name: "按日" })).toHaveAttribute("aria-selected", "true");
    expect(chart).toHaveAttribute("data-buckets", String(days));
    expect(screen.getByText("网关的按日令牌数")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "按周" }));

    expect(chart).toHaveAttribute("data-buckets", String(Math.ceil(days / 7)));
    expect(chart).toHaveAttribute("data-first", response.start_date);
    expect(screen.getByText("网关的按周令牌数")).toBeInTheDocument();
  });
});
