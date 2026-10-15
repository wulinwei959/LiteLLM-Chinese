import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import LatencyBasedConfiguration from "./LatencyBasedConfiguration";

describe("LatencyBasedConfiguration", () => {
  it("should render the section heading", () => {
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={{}} />);
    expect(screen.getByText("基于延迟的配置")).toBeInTheDocument();
  });

  it("should render default params when no args are provided", () => {
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={null as any} />);
    // Default: ttl=3600, lowest_latency_buffer=0
    expect(screen.getByDisplayValue("3600")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
  });

  it("should render the provided routing strategy args as inputs", () => {
    const args = { ttl: 7200, lowest_latency_buffer: 0.1 };
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={args} />);
    expect(screen.getByDisplayValue("7200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0.1")).toBeInTheDocument();
  });

  it("should render an input with the correct name attribute for each param", () => {
    const args = { ttl: 3600, lowest_latency_buffer: 0 };
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={args} />);
    expect(screen.getByRole("textbox", { name: /ttl/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /lowest latency buffer/i })).toBeInTheDocument();
  });

  it("should display the TTL parameter explanation", () => {
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={null as any} />);
    expect(screen.getByText(/滑动窗口/)).toBeInTheDocument();
  });

  it("should display the lowest_latency_buffer parameter explanation", () => {
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={null as any} />);
    expect(screen.getByText(/随机调度/)).toBeInTheDocument();
  });

  it("should render object values stringified into the input", () => {
    const args = { ttl: { nested: true } };
    renderWithProviders(<LatencyBasedConfiguration routingStrategyArgs={args} />);
    // HTML input type=text strips newlines, so check that the key/value appears
    const input = screen.getByRole("textbox", { name: /ttl/i }) as HTMLInputElement;
    expect(input.value).toContain('"nested"');
    expect(input.value).toContain("true");
  });
});
