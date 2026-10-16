import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders, screen, act } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import CreatedKeyDisplay from "./CreatedKeyDisplay";

import { toast } from "@/lib/toast";

describe("CreatedKeyDisplay", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render", () => {
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);
    expect(screen.getByText("sk-test-123")).toBeInTheDocument();
  });

  it("should theme the key box with tokens instead of a hardcoded light background", () => {
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);

    const keyBox = screen.getByText("sk-test-123").parentElement as HTMLElement;

    expect(keyBox).not.toHaveAttribute("style");
    expect(keyBox).toHaveClass("bg-muted");
  });

  it("should display the security warning", () => {
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);
    expect(screen.getByText(/你将无法通过 LiteLLM 账户再次查看它/)).toBeInTheDocument();
  });

  it("should show the copy button with initial label", () => {
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);
    expect(screen.getByRole("button", { name: /复制虚拟密钥/ })).toBeInTheDocument();
  });

  it("should change button text to Copied after clicking copy", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);

    await user.click(screen.getByRole("button", { name: /复制虚拟密钥/ }));

    expect(screen.getByRole("button", { name: /已复制/ })).toBeInTheDocument();
  });

  it("should show a success message when the key is copied", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);

    await user.click(screen.getByRole("button", { name: /复制虚拟密钥/ }));

    expect(toast.success).toHaveBeenCalledWith("密钥已复制到剪贴板");
  });

  it("should revert button text back after 2 seconds", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<CreatedKeyDisplay apiKey="sk-test-123" />);

    await user.click(screen.getByRole("button", { name: /复制虚拟密钥/ }));
    expect(screen.getByRole("button", { name: /已复制/ })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole("button", { name: /复制虚拟密钥/ })).toBeInTheDocument();
  });
});
