import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import { describe, it, expect } from "vitest";
import { SimpleToolCallBlock } from "./SimpleToolCallBlock";

describe("SimpleToolCallBlock", () => {
  it("should render the tool name", () => {
    renderWithProviders(<SimpleToolCallBlock tool={{ id: "1", name: "get_weather", arguments: {} }} />);
    expect(screen.getByText("get_weather")).toBeInTheDocument();
  });

  it('should display the "function" badge in Chinese', () => {
    renderWithProviders(<SimpleToolCallBlock tool={{ id: "1", name: "get_weather", arguments: {} }} />);
    expect(screen.getByText("函数")).toBeInTheDocument();
  });

  it("should render arguments when present", () => {
    renderWithProviders(
      <SimpleToolCallBlock
        tool={{
          id: "1",
          name: "get_weather",
          arguments: { city: "London", units: "metric" },
        }}
      />,
    );
    expect(screen.getByText("city:")).toBeInTheDocument();
    expect(screen.getByText('"London"')).toBeInTheDocument();
    expect(screen.getByText("units:")).toBeInTheDocument();
    expect(screen.getByText('"metric"')).toBeInTheDocument();
  });

  it("should not render arguments section when arguments are empty", () => {
    renderWithProviders(<SimpleToolCallBlock tool={{ id: "1", name: "get_weather", arguments: {} }} />);
    // 工具名与“函数”徽标仍在，但不渲染键值对
    expect(screen.getByText("get_weather")).toBeInTheDocument();
    expect(screen.queryByText(/:$/)).not.toBeInTheDocument();
  });
});
