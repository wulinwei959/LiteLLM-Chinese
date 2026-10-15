import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "../../../../../tests/test-utils";
import SSOSettingsEmptyPlaceholder from "./SSOSettingsEmptyPlaceholder";

describe("SSOSettingsEmptyPlaceholder", () => {
  it("should render", () => {
    const onAdd = vi.fn();

    renderWithProviders(<SSOSettingsEmptyPlaceholder onAdd={onAdd} />);

    expect(screen.getByText("未找到 SSO 配置")).toBeInTheDocument();
    expect(screen.getByText("配置 SSO")).toBeInTheDocument();
  });
});
