import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserAgentActivity from "./user_agent_activity";
import * as networking from "./networking";
import { renderWithProviders } from "../../tests/test-utils";

// Mock the networking module
vi.mock("./networking", () => ({
  userAgentSummaryCall: vi.fn(),
  tagDauCall: vi.fn(),
  tagWauCall: vi.fn(),
  tagMauCall: vi.fn(),
  tagDistinctCall: vi.fn(),
}));

// Mock PerUserUsage component
vi.mock("./per_user_usage", () => ({
  default: () => <div>Per User Usage</div>,
}));

describe("UserAgentActivity", () => {
  const mockUserAgentSummaryCall = vi.mocked(networking.userAgentSummaryCall);
  const mockTagDauCall = vi.mocked(networking.tagDauCall);
  const mockTagWauCall = vi.mocked(networking.tagWauCall);
  const mockTagMauCall = vi.mocked(networking.tagMauCall);
  const mockTagDistinctCall = vi.mocked(networking.tagDistinctCall);

  const mockDistinctTagsData = {
    results: [{ tag: "User-Agent: Chrome/1.0" }, { tag: "User-Agent: Firefox/2.0" }, { tag: "User-Agent: Safari/3.0" }],
  };

  const mockSummaryData = {
    results: [
      {
        tag: "User-Agent: Chrome/1.0",
        unique_users: 100,
        total_requests: 1000,
        successful_requests: 950,
        failed_requests: 50,
        total_tokens: 50000,
        total_spend: 25.5,
      },
      {
        tag: "User-Agent: Firefox/2.0",
        unique_users: 80,
        total_requests: 800,
        successful_requests: 760,
        failed_requests: 40,
        total_tokens: 40000,
        total_spend: 20.3,
      },
    ],
  };

  const mockDauData = {
    results: [
      {
        tag: "User-Agent: Chrome/1.0",
        active_users: 50,
        date: "2025-01-01",
      },
      {
        tag: "User-Agent: Firefox/2.0",
        active_users: 30,
        date: "2025-01-01",
      },
    ],
  };

  const mockWauData = {
    results: [
      {
        tag: "User-Agent: Chrome/1.0",
        active_users: 200,
        date: "Week 1 (Jan 1)",
      },
    ],
  };

  const mockMauData = {
    results: [
      {
        tag: "User-Agent: Chrome/1.0",
        active_users: 500,
        date: "Month 1 (Jan)",
      },
    ],
  };

  const defaultProps = {
    accessToken: "test-token",
    userRole: "Admin",
    dateValue: {
      from: new Date("2025-01-01"),
      to: new Date("2025-01-31"),
    },
  };

  beforeEach(() => {
    mockUserAgentSummaryCall.mockClear();
    mockTagDauCall.mockClear();
    mockTagWauCall.mockClear();
    mockTagMauCall.mockClear();
    mockTagDistinctCall.mockClear();

    mockTagDistinctCall.mockResolvedValue(mockDistinctTagsData);
    mockUserAgentSummaryCall.mockResolvedValue(mockSummaryData);
    mockTagDauCall.mockResolvedValue(mockDauData);
    mockTagWauCall.mockResolvedValue(mockWauData);
    mockTagMauCall.mockResolvedValue(mockMauData);
  });

  it("should render summary cards with user agent data", async () => {
    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(mockUserAgentSummaryCall).toHaveBeenCalled();
      expect(mockTagDistinctCall).toHaveBeenCalled();
    });

    // Check that summary section is displayed
    expect(screen.getByText("按用户代理汇总")).toBeInTheDocument();
    expect(screen.getByText("不同用户代理的性能指标")).toBeInTheDocument();

    // Check that user agent cards are displayed
    await waitFor(() => {
      expect(screen.getAllByText("Chrome/1.0").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Firefox/2.0").length).toBeGreaterThan(0);
    });

    // Check that metrics are displayed
    expect(screen.getAllByText("成功请求数").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Token 总数").length).toBeGreaterThan(0);
    expect(screen.getAllByText("总费用").length).toBeGreaterThan(0);
  });

  it("should switch between DAU, WAU, and MAU tabs", async () => {
    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(mockTagDauCall).toHaveBeenCalled();
      expect(mockTagWauCall).toHaveBeenCalled();
      expect(mockTagMauCall).toHaveBeenCalled();
    });

    // Check default DAU tab content
    expect(screen.getByText("日活跃用户 - 近 7 天")).toBeInTheDocument();

    // Find all WAU tab buttons (there might be multiple)
    const wauTabs = screen.getAllByText("WAU");
    fireEvent.click(wauTabs[0]);

    // Check WAU tab content
    await waitFor(() => {
      expect(screen.getByText("周活跃用户 - 近 7 周")).toBeInTheDocument();
    });

    // Find all MAU tab buttons
    const mauTabs = screen.getAllByText("MAU");
    fireEvent.click(mauTabs[0]);

    // Check MAU tab content
    await waitFor(() => {
      expect(screen.getByText("月活跃用户 - 近 7 个月")).toBeInTheDocument();
    });
  });

  it("should display filter dropdown and allow tag selection", async () => {
    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    // Wait for tags to load
    await waitFor(() => {
      expect(mockTagDistinctCall).toHaveBeenCalled();
    });

    // Check that filter label is present
    expect(screen.getByText("按用户代理筛选")).toBeInTheDocument();

    // One library paints the prompt as its own text node and the other leaves it on the input's
    // placeholder attribute, so either one means the user is being told what the filter does.
    const prompts =
      screen.queryAllByText("所有用户代理").length + screen.queryAllByPlaceholderText("所有用户代理").length;
    expect(prompts).toBeGreaterThan(0);
  });

  // Walks up from the panel's heading to the nearest ancestor that owns a chart, so the
  // assertions do not depend on how many wrappers the tab library puts around a panel.
  const chartForTitle = (title: string): HTMLElement => {
    let node: HTMLElement | null = screen.getByText(title);
    while (node && !node.querySelector('[data-slot="chart"]')) {
      node = node.parentElement;
    }
    const chart = node?.querySelector('[data-slot="chart"]') ?? null;
    expect(chart).not.toBeNull();
    return chart as HTMLElement;
  };

  const expectStackedTwoCategoryChart = (chart: HTMLElement, firstBucketLabel: string) => {
    expect(chart.querySelectorAll(".recharts-bar")).toHaveLength(2);

    const rectangles = Array.from(chart.querySelectorAll("path.recharts-rectangle"));
    const fills = new Set(rectangles.map((rect) => rect.getAttribute("fill")));
    expect(fills).toEqual(new Set(["var(--color-blue-500, #3b82f6)", "var(--color-cyan-500, #06b6d4)"]));

    const xPositions = new Set(rectangles.map((rect) => rect.getAttribute("d")?.match(/^M\s*([\d.]+)/)?.[1]));
    expect(xPositions.size).toBe(1);

    expect(chart).toHaveTextContent(/Chrome\/1\.0/);
    expect(chart).toHaveTextContent(/Firefox\/2\.0/);
    expect(chart).toHaveTextContent(new RegExp(firstBucketLabel));

    const tickTexts = Array.from(chart.querySelectorAll(".recharts-cartesian-axis-tick-value")).map(
      (tick) => tick.textContent ?? "",
    );
    expect(tickTexts.some((tick) => /^\d+K$/.test(tick))).toBe(true);
  };

  it("keeps every tab panel mounted so switching tabs does not reset their state", async () => {
    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    await waitFor(() => {
      expect(mockTagDauCall).toHaveBeenCalled();
    });

    // No tab has been clicked: the inactive DAU/WAU/MAU panels are mounted alongside the active one.
    expect(screen.getByText("日活跃用户 - 近 7 天")).toBeInTheDocument();
    expect(screen.getByText("周活跃用户 - 近 7 周")).toBeInTheDocument();
    expect(screen.getByText("月活跃用户 - 近 7 个月")).toBeInTheDocument();

    // And so is the second panel of the outer tab group.
    expect(screen.getByText("Per User Usage")).toBeInTheDocument();
  });

  it("renders the DAU chart stacked with default color cycle and abbreviated axis ticks", async () => {
    const firstBucketDate = new Date();
    firstBucketDate.setDate(firstBucketDate.getDate() - 6);
    const todayStr = new Date().toISOString().split("T")[0];
    mockTagDauCall.mockResolvedValue({
      results: [
        { tag: "User-Agent: Chrome/1.0", active_users: 4000, date: todayStr },
        { tag: "User-Agent: Firefox/2.0", active_users: 2600, date: todayStr },
      ],
    });

    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    await waitFor(() => {
      expect(chartForTitle("日活跃用户 - 近 7 天").querySelectorAll("path.recharts-rectangle")).toHaveLength(2);
    });

    expectStackedTwoCategoryChart(chartForTitle("日活跃用户 - 近 7 天"), firstBucketDate.toISOString().split("T")[0]);
  });

  it("renders the WAU chart stacked with week buckets and abbreviated axis ticks", async () => {
    mockTagWauCall.mockResolvedValue({
      results: [
        { tag: "User-Agent: Chrome/1.0", active_users: 2000, date: "Week 3 (Jan 15)" },
        { tag: "User-Agent: Firefox/2.0", active_users: 1500, date: "Week 3 (Jan 15)" },
      ],
    });

    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    await waitFor(() => {
      expect(chartForTitle("周活跃用户 - 近 7 周").querySelectorAll("path.recharts-rectangle")).toHaveLength(2);
    });

    expectStackedTwoCategoryChart(chartForTitle("周活跃用户 - 近 7 周"), "第 1 周");
  });

  it("renders the MAU chart stacked with month buckets and abbreviated axis ticks", async () => {
    mockTagMauCall.mockResolvedValue({
      results: [
        { tag: "User-Agent: Chrome/1.0", active_users: 5000, date: "Month 2 (Feb)" },
        { tag: "User-Agent: Firefox/2.0", active_users: 3000, date: "Month 2 (Feb)" },
      ],
    });

    renderWithProviders(<UserAgentActivity {...defaultProps} />);

    await waitFor(() => {
      expect(chartForTitle("月活跃用户 - 近 7 个月").querySelectorAll("path.recharts-rectangle")).toHaveLength(2);
    });

    expectStackedTwoCategoryChart(chartForTitle("月活跃用户 - 近 7 个月"), "第 1 月");
  });
});
