import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders the input label with token, cost and turn metrics", () => {
    renderWithProviders(<SectionHeader type="input" tokens={1234} cost={0.000123} turnCount={3} onCopy={vi.fn()} />);

    expect(screen.getByText("输入")).toBeInTheDocument();
    expect(screen.getByText("令牌：1,234")).toBeInTheDocument();
    expect(screen.getByText("成本：$0.000123")).toBeInTheDocument();
    expect(screen.getByText("轮次：3")).toBeInTheDocument();
  });

  it("renders the output label", () => {
    renderWithProviders(<SectionHeader type="output" onCopy={vi.fn()} />);

    expect(screen.getByText("输出")).toBeInTheDocument();
  });

  it("omits metrics that were not provided", () => {
    renderWithProviders(<SectionHeader type="input" onCopy={vi.fn()} />);

    expect(screen.queryByText(/^令牌：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^成本：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^轮次：/)).not.toBeInTheDocument();
  });

  it("omits the turn count when there are no turns", () => {
    renderWithProviders(<SectionHeader type="input" turnCount={0} onCopy={vi.fn()} />);

    expect(screen.queryByText(/^轮次：/)).not.toBeInTheDocument();
  });

  it("copies without toggling the section", async () => {
    const onCopy = vi.fn();
    const onToggleCollapse = vi.fn();
    renderWithProviders(<SectionHeader type="input" onCopy={onCopy} onToggleCollapse={onToggleCollapse} />);

    await userEvent.click(screen.getByRole("button", { name: "复制输入" }));

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onToggleCollapse).not.toHaveBeenCalled();
  });

  it("toggles the section when the header is clicked", async () => {
    const onToggleCollapse = vi.fn();
    renderWithProviders(<SectionHeader type="input" onCopy={vi.fn()} onToggleCollapse={onToggleCollapse} />);

    await userEvent.click(screen.getByText("输入"));

    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it("reports its collapsed state to assistive technology", () => {
    const { rerender } = renderWithProviders(
      <SectionHeader type="input" onCopy={vi.fn()} onToggleCollapse={vi.fn()} isCollapsed={false} />,
    );

    expect(screen.getByRole("button", { name: /^输入/ })).toHaveAttribute("aria-expanded", "true");

    rerender(<SectionHeader type="input" onCopy={vi.fn()} onToggleCollapse={vi.fn()} isCollapsed={true} />);

    expect(screen.getByRole("button", { name: /^输入/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("names each copy button for the section it belongs to", () => {
    renderWithProviders(<SectionHeader type="output" onCopy={vi.fn()} onToggleCollapse={vi.fn()} />);

    expect(screen.getByRole("button", { name: "复制输出" })).toBeInTheDocument();
  });

  it("stays inert when no toggle handler is given", async () => {
    const onCopy = vi.fn();
    renderWithProviders(<SectionHeader type="input" onCopy={onCopy} />);

    await userEvent.click(screen.getByText("输入"));

    expect(onCopy).not.toHaveBeenCalled();
  });
});
