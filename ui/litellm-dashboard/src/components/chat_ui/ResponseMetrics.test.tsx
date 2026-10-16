import { renderWithProviders, screen } from "../../../tests/test-utils";
import { describe, it, expect } from "vitest";
import ResponseMetrics, { type TokenUsage } from "./ResponseMetrics";

const baseUsage: TokenUsage = { promptTokens: 5000, completionTokens: 12, totalTokens: 5012 };

describe("ResponseMetrics prompt cache chips", () => {
  it("renders both cache chips when the provider reports reads and writes", () => {
    renderWithProviders(<ResponseMetrics usage={{ ...baseUsage, cacheReadTokens: 4695, cacheCreationTokens: 1234 }} />);

    expect(screen.getByText("缓存读取: 4695")).toBeInTheDocument();
    expect(screen.getByText("缓存写入: 1234")).toBeInTheDocument();
  });

  it("renders only the read chip when the provider reports reads alone", () => {
    renderWithProviders(<ResponseMetrics usage={{ ...baseUsage, cacheReadTokens: 4695 }} />);

    expect(screen.getByText("缓存读取: 4695")).toBeInTheDocument();
    expect(screen.queryByText(/缓存写入/)).not.toBeInTheDocument();
  });

  it("renders no cache chips for a provider that reports no cache fields", () => {
    renderWithProviders(<ResponseMetrics usage={baseUsage} />);

    expect(screen.getByText("输入: 5000")).toBeInTheDocument();
    expect(screen.queryByText(/缓存读取/)).not.toBeInTheDocument();
    expect(screen.queryByText(/缓存写入/)).not.toBeInTheDocument();
  });

  it("renders no cache chips when the provider reports zero cache tokens", () => {
    renderWithProviders(<ResponseMetrics usage={{ ...baseUsage, cacheReadTokens: 0, cacheCreationTokens: 0 }} />);

    expect(screen.queryByText(/缓存读取/)).not.toBeInTheDocument();
    expect(screen.queryByText(/缓存写入/)).not.toBeInTheDocument();
  });

  it("shows the response cache indicator instead of the provider cache chips on a response-cache hit", () => {
    renderWithProviders(
      <ResponseMetrics
        usage={{ ...baseUsage, cacheReadTokens: 4695, cacheCreationTokens: 1234, servedFromResponseCache: true }}
      />,
    );

    expect(screen.getByText("响应缓存: 命中")).toBeInTheDocument();
    expect(screen.queryByText(/缓存读取/)).not.toBeInTheDocument();
    expect(screen.queryByText(/缓存写入/)).not.toBeInTheDocument();
  });

  it("does not show the response cache indicator when the flag is absent", () => {
    renderWithProviders(<ResponseMetrics usage={baseUsage} />);

    expect(screen.queryByText(/响应缓存/)).not.toBeInTheDocument();
  });

  it("does not render the Cost chip when a persisted cost is null", () => {
    renderWithProviders(<ResponseMetrics usage={{ promptTokens: 1, cost: null as unknown as number }} />);

    expect(screen.queryByText(/成本:/)).not.toBeInTheDocument();
    expect(screen.getByText("输入: 1")).toBeInTheDocument();
  });

  it("does not render the Cost chip for NaN", () => {
    renderWithProviders(<ResponseMetrics usage={{ ...baseUsage, cost: Number.NaN }} />);

    expect(screen.queryByText(/成本:/)).not.toBeInTheDocument();
  });

  it("renders the Cost chip for a finite cost", () => {
    renderWithProviders(<ResponseMetrics usage={{ ...baseUsage, cost: 0.000063 }} />);

    expect(screen.getByText("成本: $0.000063")).toBeInTheDocument();
  });
});
