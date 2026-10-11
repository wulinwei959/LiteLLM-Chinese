import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { describe, expect, it, vi } from "vitest";

import type { DailyData, KeyMetricWithMetadata, SpendMetrics } from "@/components/UsagePage/types";
import type { DailyActivityRange } from "./useDailyActivityRange";

vi.mock("@/components/shared/advanced_date_picker", () => ({
  __esModule: true,
  default: () => <div data-testid="date-picker" />,
}));

import CacheLeakageCard from "./CacheLeakageCard";

const baseMetrics = (overrides: Partial<SpendMetrics>): SpendMetrics => ({
  spend: 0,
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
  api_requests: 0,
  successful_requests: 0,
  failed_requests: 0,
  cache_read_input_tokens: 0,
  cache_creation_input_tokens: 0,
  ...overrides,
});

const key = (alias: string, metrics: Partial<SpendMetrics>): KeyMetricWithMetadata => ({
  metrics: baseMetrics(metrics),
  metadata: { key_alias: alias, team_id: null },
});

const dayWithKeys = (date: string, apiKeys: Record<string, KeyMetricWithMetadata>): DailyData => ({
  date,
  metrics: baseMetrics({}),
  breakdown: {
    models: {},
    model_groups: {},
    mcp_servers: {},
    providers: {},
    api_keys: apiKeys,
    entities: {},
  },
});

const dayWithModels = (date: string, models: Record<string, Partial<SpendMetrics>>): DailyData => ({
  date,
  metrics: baseMetrics({}),
  breakdown: {
    models: {},
    model_groups: Object.fromEntries(
      Object.entries(models).map(([name, m]) => [
        name,
        { metrics: baseMetrics(m), metadata: {}, api_key_breakdown: {} },
      ]),
    ),
    mcp_servers: {},
    providers: {},
    api_keys: {},
    entities: {},
  },
});

const renderWith = (results: DailyData[], overrides: Partial<DailyActivityRange> = {}) =>
  renderWithProviders(
    <CacheLeakageCard
      activity={{
        dateValue: {},
        onDateChange: vi.fn(),
        results,
        loading: false,
        isFetchingMore: false,
        progress: { currentPage: 1, totalPages: 1 },
        cancelled: false,
        failed: false,
        cancel: vi.fn(),
        ...overrides,
      }}
    />,
  );

describe("CacheLeakageCard", () => {
  it("ranks leaking keys by uncached prompt tokens and shows cache hit ratio", () => {
    renderWith([
      dayWithKeys("2026-07-12", {
        "hash-caching": key("caching-key", { prompt_tokens: 1000, cache_read_input_tokens: 900 }),
        "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
      }),
    ]);

    expect(screen.getByText("leaky-key")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("90.0%")).toBeInTheDocument();
    [
      "该范围你发送的、既未命中缓存也未写入缓存的输入 token",
      "从缓存提供的输入 token 占比",
      /About how much|潜在节省/,
    ].forEach((info) => expect(screen.getByLabelText(info)).toBeInTheDocument());
  });

  it("sorts by the clicked column, worst cache hit rate first", () => {
    renderWith([
      dayWithKeys("2026-07-12", {
        "hash-a": key("alpha", {
          prompt_tokens: 10000,
          cache_read_input_tokens: 9000,
          prompt_caching_savings_spend: 9.0,
        }),
        "hash-b": key("bravo", {
          prompt_tokens: 500,
          cache_read_input_tokens: 50,
          prompt_caching_savings_spend: 0.05,
        }),
      }),
    ]);
    const firstDataRow = () => screen.getAllByRole("row")[1];

    expect(firstDataRow()).toHaveTextContent("alpha");

    fireEvent.click(screen.getByText("缓存命中率"));
    expect(firstDataRow()).toHaveTextContent("bravo");

    fireEvent.click(screen.getByText("缓存命中率"));
    expect(firstDataRow()).toHaveTextContent("alpha");
  });

  it("switches to the model view and lists models from every provider", () => {
    renderWith([
      dayWithModels("2026-07-12", {
        "claude-sonnet-5": { prompt_tokens: 5000, cache_read_input_tokens: 0 },
        "vertex_ai/gemini-2.5-pro": { prompt_tokens: 8000, cache_read_input_tokens: 2000 },
      }),
    ]);

    fireEvent.click(screen.getByText("按模型"));

    expect(screen.getByText("按模型的缓存泄漏")).toBeInTheDocument();
    expect(screen.getByText("claude-sonnet-5")).toBeInTheDocument();
    expect(screen.getByText("vertex_ai/gemini-2.5-pro")).toBeInTheDocument();
  });

  it("shows an empty state when no key used tokens in the range", () => {
    renderWith([dayWithKeys("2026-07-12", {})]);

    expect(screen.getByText("该范围无密钥用量。")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("tells the user the table is still filling in while fallback pages stream", () => {
    const day = dayWithKeys("2026-07-12", {
      "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
    });
    renderWith([day], { isFetchingMore: true });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByText("数据仍在加载，其余范围到达后行与总计会更新。"),
    ).toBeInTheDocument();
  });

  it("keeps the streaming note off while a fresh range loads over the previous range's rows", () => {
    const day = dayWithKeys("2026-07-12", {
      "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
    });
    renderWith([day], { loading: true });

    expect(
      screen.queryByText("数据仍在加载，其余范围到达后行与总计会更新。"),
    ).not.toBeInTheDocument();
  });

  it("drops the streaming note once the range has settled", () => {
    const day = dayWithKeys("2026-07-12", {
      "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
    });
    renderWith([day]);

    expect(
      screen.queryByText("数据仍在加载，其余范围到达后行与总计会更新。"),
    ).not.toBeInTheDocument();
  });

  it("says which keys are missing from the key ranking when the proxy capped the per-key lists", () => {
    const day = dayWithKeys("2026-07-12", {
      "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
    });
    renderWith([day], { apiKeyTruncation: { limit: 100, total: 3000 } });

    expect(screen.getByRole("note")).toHaveTextContent(
      /仅加载支出最高的|highest-spend keys/,
    );

    fireEvent.click(screen.getByRole("tab", { name: "按模型" }));

    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("keeps the key ranking note off when every key was loaded", () => {
    const day = dayWithKeys("2026-07-12", {
      "hash-leaky": key("leaky-key", { prompt_tokens: 10000, cache_read_input_tokens: 0 }),
    });
    renderWith([day]);

    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});
