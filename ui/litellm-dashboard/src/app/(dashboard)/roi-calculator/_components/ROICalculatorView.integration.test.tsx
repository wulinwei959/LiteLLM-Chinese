import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { apiClient } from "@/components/networking";
import { renderWithProviders } from "../../../../../tests/test-utils";
import ROICalculatorView from "./ROICalculatorView";

vi.mock("@/components/networking", () => ({
  apiClient: {
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ChartLegend: () => null,
  ChartLegendContent: () => null,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));
vi.mock("recharts", () => ({
  Bar: () => null,
  CartesianGrid: () => null,
  ComposedChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

const summary = {
  id: null,
  mode: "live",
  start: "2026-09-01",
  end: "2026-09-30",
  synced_at: "2026-09-30T12:00:00Z",
  repos: ["org/repo"],
  estimator_model: "estimator",
  estimator_prompt: "Estimate hours.",
  warnings: [],
  effort_basis: "without_ai",
  metrics: {
    matched_spend: 12,
    output_hours: 4,
    total_spend: 20,
    total_output_hours: 4,
    excluded_spend: 8,
    cost_per_hour: 3,
    hours_per_dollar: 1 / 3,
    merged_prs: 1,
    estimated_prs: 1,
    matched_prs: 1,
    cohort_people: 1,
    people_with_prs: 1,
    pending_prs: 0,
  },
  people: [
    {
      id: "alice@example.com",
      email: "alice@example.com",
      logins: ["alice", "alice-work"],
      spend: 12,
      hours: 4,
      prs: 1,
      estimated_prs: 1,
      pending_prs: 0,
      match_methods: ["profile email"],
      eligible: true,
      cost_per_hour: 3,
    },
  ],
  pulls: [
    {
      repo: "org/repo",
      number: 42,
      title: "Improve request routing",
      url: "https://github.com/org/repo/pull/42",
      login: "alice",
      emails: ["alice@example.com"],
      profile_email: "alice@example.com",
      merged_at: "2026-09-12T00:00:00Z",
      head_sha: "abc",
      additions: 10,
      deletions: 2,
      changed_files: 1,
      commit_count: 1,
      incomplete_metadata: false,
      estimate: {
        status: "estimated",
        hours: 4,
        reasoning: "Updated routing and added a regression test.",
        model: "estimator",
        evidence_source: "pr_metadata",
        effort_basis: "without_ai",
        cached: false,
      },
      cache_key: "cache",
      email: "alice@example.com",
      match_method: "profile email",
      matched: true,
    },
  ],
  trend: [{ date: "2026-09-12", spend: 12, hours: 4, prs: 1 }],
} as const;

const settings = {
  github_api_url: "https://api.github.com",
  repos: ["org/repo"],
  estimator_model: "estimator",
  estimator_prompt: "Estimate hours.",
  backfill_days: 30,
  identity_map: {},
  has_github_token: true,
  default_prompt: "Estimate hours.",
  available_models: ["estimator"],
  ready: true,
};

const idleStatus = {
  running: false,
  phase: "idle",
  stage: "Idle",
  done: 0,
  total: 0,
  estimated: 0,
  reused: 0,
  needs_attention: 0,
  error: null,
};

describe("ROICalculatorView", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.get).mockImplementation((path: string) => {
      if (path === "/roi-calculator/settings") return Promise.resolve(settings);
      if (path === "/roi-calculator/report") return Promise.resolve({ report: summary });
      return Promise.resolve(idleStatus);
    });
    vi.mocked(apiClient.put).mockResolvedValue({ report: summary, identity_map: { alice: "alice@example.com" } });
  });

  it("shows the spend summary and opens an accessible pull reasoning dialog", async () => {
    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByText("每估算工程小时的花费")).toBeInTheDocument();
    expect(screen.getByText("$3.00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "打开 org/repo 拉取请求 42 的估算" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Updated routing and added a regression test.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "在 GitHub 上查看" })).toHaveAttribute(
      "href",
      "https://github.com/org/repo/pull/42",
    );
  });

  it("shows incomplete repository results without a spend-per-hour figure", async () => {
    const warning = "Incomplete report: could not read org/unavailable. Spend-per-hour figures are unavailable.";
    vi.mocked(apiClient.get).mockImplementation((path: string) => {
      if (path === "/roi-calculator/settings") return Promise.resolve(settings);
      if (path === "/roi-calculator/report") {
        return Promise.resolve({
          report: {
            ...summary,
            warnings: [warning],
            metrics: { ...summary.metrics, cost_per_hour: null, hours_per_dollar: null },
            people: summary.people.map((person) => ({ ...person, cost_per_hour: null })),
          },
        });
      }
      return Promise.resolve(idleStatus);
    });

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("alert")).toHaveTextContent(warning);
    expect(screen.getByRole("button", { name: "打开 org/repo 拉取请求 42 的估算" })).toBeInTheDocument();
    expect(screen.queryByText("$3.00")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("计算详情"));
    expect(screen.getByText("在所有选定仓库均可读取之前，无法计算每估算小时花费。")).toBeVisible();
  });

  it("lets a view-only admin read the report without write controls", async () => {
    const runningStatus = {
      ...idleStatus,
      running: true,
      phase: "estimating",
      stage: "Estimating pull requests",
      total: 1,
    };
    vi.mocked(apiClient.get).mockImplementation((path: string) => {
      if (path === "/roi-calculator/settings") return Promise.resolve(settings);
      if (path === "/roi-calculator/report") return Promise.resolve({ report: summary });
      return Promise.resolve(runningStatus);
    });

    renderWithProviders(<ROICalculatorView accessToken="token" userRole="Admin" isViewOnly />);

    expect(await screen.findByText("每估算工程小时的花费")).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent("只读访问");
    expect(screen.queryByRole("button", { name: "运行分析" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "取消同步" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "人员" }));
    expect(screen.getByText("alice-work")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "alice-work" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "设置" }));
    expect(screen.getByLabelText("GitHub 令牌")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "保存设置" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "运行分析" })).not.toBeInTheDocument();
  });

  it("lets an admin open the people view and save a manual email match", async () => {
    renderWithProviders(<ROICalculatorView accessToken="token" />);

    fireEvent.click(await screen.findByRole("tab", { name: "人员" }));
    fireEvent.click(await screen.findByRole("button", { name: "alice-work" }));
    fireEvent.change(screen.getByLabelText("网关邮箱"), {
      target: { value: "alice+work@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "保存匹配" }));

    await waitFor(() =>
      expect(apiClient.put).toHaveBeenCalledWith("/roi-calculator/identity-map", {
        accessToken: "token",
        body: { github_login: "alice-work", email: "alice+work@example.com" },
      }),
    );
  });

  it("presents onboarding settings once when no report exists", async () => {
    const emptySettings = { ...settings, has_github_token: false, ready: false, repos: [], estimator_model: "" };
    vi.mocked(apiClient.get).mockImplementation((path: string) => {
      if (path === "/roi-calculator/settings") return Promise.resolve(emptySettings);
      if (path === "/roi-calculator/report") return Promise.resolve({ report: null });
      return Promise.resolve(idleStatus);
    });

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("heading", { name: "连接 GitHub 以开始" })).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub 令牌")).toHaveAttribute("type", "password");
    expect(screen.getAllByText("连接 GitHub 以开始")).toHaveLength(1);
  });

  it("returns to Overview and shows the last sync time when completion is polled from Settings", async () => {
    const runningStatus = {
      ...idleStatus,
      running: true,
      phase: "estimating",
      stage: "Estimating pull requests",
      total: 1,
    };
    const completedStatus = { ...idleStatus, phase: "complete", done: 57, total: 57, reused: 57 };
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(settings)
      .mockResolvedValueOnce({ report: null })
      .mockResolvedValueOnce(runningStatus)
      .mockResolvedValueOnce(completedStatus)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            window.setTimeout(() => resolve({ report: summary }), 25);
          }),
      );

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("progressbar", { name: "同步进度" })).toBeInTheDocument();
    expect(await screen.findByText("每估算工程小时的花费", {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "连接 GitHub 以开始" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("上次同步 Sep 30, 2026, 12:00 PM UTC");
    expect(screen.getByRole("status")).toHaveTextContent("已复用 57 项估算中的 57 项");
  });

  it("shows the sync error returned by the status endpoint", async () => {
    const runningStatus = {
      ...idleStatus,
      running: true,
      phase: "estimating",
      stage: "Estimating pull requests",
      total: 1,
    };
    const errorStatus = {
      ...idleStatus,
      phase: "error",
      error: "The estimator could not score a pull request.",
    };
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(settings)
      .mockResolvedValueOnce({ report: null })
      .mockResolvedValueOnce(runningStatus)
      .mockResolvedValueOnce(errorStatus);

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("alert", {}, { timeout: 5000 })).toHaveTextContent(
      "The estimator could not score a pull request.",
    );
    expect(screen.getByText("同步失败")).toBeInTheDocument();
  });

  it("shows a report error and ends progress when the completed report cannot load", async () => {
    const runningStatus = {
      ...idleStatus,
      running: true,
      phase: "estimating",
      stage: "Estimating pull requests",
      total: 1,
    };
    const completedStatus = { ...idleStatus, phase: "complete", done: 1, total: 1 };
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(settings)
      .mockResolvedValueOnce({ report: null })
      .mockResolvedValueOnce(runningStatus)
      .mockResolvedValueOnce(completedStatus)
      .mockRejectedValueOnce(new Error("The report could not be loaded."));

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("progressbar", { name: "同步进度" })).toBeInTheDocument();
    expect(await screen.findByRole("alert", {}, { timeout: 5000 })).toHaveTextContent(
      "The report could not be loaded.",
    );
    expect(screen.queryByRole("progressbar", { name: "同步进度" })).not.toBeInTheDocument();
  });

  it("clears a transient poll error when the next poll completes and loads the report", async () => {
    const runningStatus = {
      ...idleStatus,
      running: true,
      phase: "estimating",
      stage: "Estimating pull requests",
      total: 1,
    };
    const completedStatus = { ...idleStatus, phase: "complete", done: 1, total: 1 };
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce(settings)
      .mockResolvedValueOnce({ report: null })
      .mockResolvedValueOnce(runningStatus)
      .mockRejectedValueOnce(new Error("The sync status could not be loaded."))
      .mockResolvedValueOnce(completedStatus)
      .mockResolvedValueOnce({ report: summary });

    renderWithProviders(<ROICalculatorView accessToken="token" />);

    expect(await screen.findByRole("progressbar", { name: "同步进度" })).toBeInTheDocument();
    expect(await screen.findByRole("alert", {}, { timeout: 5000 })).toHaveTextContent(
      "The sync status could not be loaded.",
    );
    expect(await screen.findByText("每估算工程小时的花费", {}, { timeout: 7000 })).toBeInTheDocument();
    expect(screen.queryByText("The sync status could not be loaded.")).not.toBeInTheDocument();
  });
  it("saves the edited schedule before running from Settings", async () => {
    vi.mocked(apiClient.put).mockResolvedValue(settings);
    vi.mocked(apiClient.post).mockResolvedValue({ ...idleStatus, running: true });
    renderWithProviders(<ROICalculatorView accessToken="token" />);
    fireEvent.click(await screen.findByRole("tab", { name: "设置" }));
    fireEvent.change(screen.getByLabelText("更新间隔（小时）"), { target: { value: "6" } });
    fireEvent.click(screen.getByRole("button", { name: "保存并运行分析" }));
    await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith("/roi-calculator/sync", { accessToken: "token" }));
    expect(apiClient.put).toHaveBeenCalledWith(
      "/roi-calculator/settings",
      expect.objectContaining({
        body: expect.objectContaining({ update_interval_minutes: 360, estimator_model: "estimator" }),
      }),
    );
    expect(vi.mocked(apiClient.put).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(apiClient.post).mock.invocationCallOrder[0],
    );
  });
});
