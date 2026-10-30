import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { OverviewTotals } from "./overviewData";
import UsageStatStrip from "./UsageStatStrip";

const totals: OverviewTotals = {
  spend: 42.5,
  requests: 10,
  successful: 8,
  failed: 2,
  tokens: 9123456,
  inputTokens: 8123456,
  outputTokens: 1000000,
  cacheReadTokens: 5123456,
  cacheWriteTokens: 2000000,
  avgCostPerRequest: 4.25,
  avgLatencyMs: 250,
  successRate: 80,
};

const defaultProps = {
  results: [],
  totals,
  loading: false,
  requestCountsPending: false,
  budget: null,
};

describe("UsageStatStrip token breakdown", () => {
  it("should render the existing totals and open the full token counts", async () => {
    const user = userEvent.setup();
    render(<UsageStatStrip {...defaultProps} />);

    expect(screen.getByText("总令牌数")).toBeInTheDocument();
    expect(screen.getByText("成功")).toBeInTheDocument();
    expect(screen.getByText("失败")).toBeInTheDocument();
    expect(screen.getByText("成功率 80.0%")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看 token 明细" }));
    const breakdown = await screen.findByRole("dialog", { name: "总 token 都算了什么？" });
    expect(breakdown).toHaveTextContent(/输入 token\s*8,123,456/);
    expect(breakdown).toHaveTextContent(/缓存读取\s*5,123,456/);
    expect(breakdown).toHaveTextContent(/缓存写入\s*2,000,000/);
    expect(breakdown).toHaveTextContent(/输出 token\s*1,000,000/);
    expect(breakdown).toHaveTextContent(/token 总数\s*9,123,456/);
    expect(breakdown).toHaveTextContent("输入包含缓存读取与写入。");
    expect(breakdown).toHaveTextContent("比较数量前，请核对同一人员、客户端与时间范围");
  });

  it("should hide the token breakdown and request counts while usage is loading", () => {
    render(<UsageStatStrip {...defaultProps} loading requestCountsPending />);

    expect(screen.getByText("总令牌数")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "查看 token 明细" })).not.toBeInTheDocument();
    expect(screen.queryByText("ok")).not.toBeInTheDocument();
    expect(screen.queryByText("failed")).not.toBeInTheDocument();
  });
});
