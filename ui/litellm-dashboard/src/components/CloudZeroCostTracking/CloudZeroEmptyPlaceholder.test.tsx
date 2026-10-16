import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CloudZeroEmptyPlaceholder from "./CloudZeroEmptyPlaceholder";
import { renderWithProviders } from "../../../tests/test-utils";

describe("CloudZeroEmptyPlaceholder", () => {
  it("should render", () => {
    const startCreation = vi.fn();
    renderWithProviders(<CloudZeroEmptyPlaceholder startCreation={startCreation} />);

    expect(screen.getByText("未找到 CloudZero 集成")).toBeInTheDocument();
    expect(screen.getByText(/连接你的 CloudZero 账户/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "添加 CloudZero 集成" })).toBeInTheDocument();
  });
});
