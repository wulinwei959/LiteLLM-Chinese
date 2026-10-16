import { screen, renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FiltersButton } from "./FiltersButton";

describe("FiltersButton", () => {
  it("should render", () => {
    const onClick = vi.fn();
    renderWithProviders(<FiltersButton onClick={onClick} active={false} hasActiveFilters={false} />);
    expect(screen.getByRole("button", { name: "筛选" })).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<FiltersButton onClick={onClick} active={false} hasActiveFilters={false} />);

    const button = screen.getByRole("button", { name: "筛选" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should show the active-filter indicator when hasActiveFilters is true", () => {
    const onClick = vi.fn();
    const { container } = renderWithProviders(
      <FiltersButton onClick={onClick} active={false} hasActiveFilters={true} />,
    );
    expect(screen.getByRole("button", { name: "筛选" })).toBeInTheDocument();
    expect(container.querySelector("sup")).toBeInTheDocument();
  });

  it("should not show the active-filter indicator when hasActiveFilters is false", () => {
    const onClick = vi.fn();
    const { container } = renderWithProviders(
      <FiltersButton onClick={onClick} active={false} hasActiveFilters={false} />,
    );
    expect(screen.getByRole("button", { name: "筛选" })).toBeInTheDocument();
    expect(container.querySelector("sup")).not.toBeInTheDocument();
  });

  it("should render custom label when provided", () => {
    const onClick = vi.fn();
    renderWithProviders(
      <FiltersButton onClick={onClick} active={false} hasActiveFilters={false} label="Advanced Filters" />,
    );
    expect(screen.getByRole("button", { name: /advanced filters/i })).toBeInTheDocument();
  });
});
