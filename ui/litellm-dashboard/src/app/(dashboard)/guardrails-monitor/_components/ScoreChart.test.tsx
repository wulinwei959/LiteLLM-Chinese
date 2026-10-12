import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { ScoreChart } from "./ScoreChart";

describe("ScoreChart", () => {
  it("should render the title", () => {
    renderWithProviders(<ScoreChart />);

    expect(screen.getByText("请求结果趋势")).toBeInTheDocument();
  });

  it("should show empty state when no data is provided", () => {
    renderWithProviders(<ScoreChart />);

    expect(screen.getByText("该时段暂无图表数据")).toBeInTheDocument();
  });

  it("should show empty state when data is an empty array", () => {
    renderWithProviders(<ScoreChart data={[]} />);

    expect(screen.getByText("该时段暂无图表数据")).toBeInTheDocument();
  });

  it("should render the chart when data is provided", () => {
    const data = [
      { date: "2026-03-01", passed: 10, blocked: 2 },
      { date: "2026-03-02", passed: 15, blocked: 1 },
    ];

    const { container } = renderWithProviders(<ScoreChart data={data} />);

    expect(screen.queryByText("该时段暂无图表数据")).not.toBeInTheDocument();
    expect(screen.getByText("通过")).toBeInTheDocument();
    expect(screen.getByText("拦截")).toBeInTheDocument();
    expect(screen.getAllByText(/2026-03-01/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2026-03-02/).length).toBeGreaterThan(0);
    const bars = container.querySelectorAll(".recharts-bar");
    expect(bars).toHaveLength(2);
  });
});
