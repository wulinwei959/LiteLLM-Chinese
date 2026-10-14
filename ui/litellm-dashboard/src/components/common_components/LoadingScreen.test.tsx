import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../../tests/test-utils";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("should render", () => {
    renderWithProviders(<LoadingScreen />);
    expect(screen.getByText("加载中...")).toBeInTheDocument();
  });
});
