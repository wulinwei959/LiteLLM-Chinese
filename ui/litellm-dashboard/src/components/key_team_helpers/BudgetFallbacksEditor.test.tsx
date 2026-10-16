import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders as render, screen } from "../../../tests/test-utils";
import { BudgetFallbacksEditor } from "./BudgetFallbacksEditor";

const MODELS = ["gpt-4", "gpt-3.5-turbo", "claude-3", "claude-haiku"];

describe("BudgetFallbacksEditor", () => {
  it("renders empty state with add button", () => {
    const onChange = vi.fn();
    render(<BudgetFallbacksEditor value={{}} onChange={onChange} availableModels={MODELS} />);
    expect(screen.getByText("添加预算回退")).toBeInTheDocument();
    expect(screen.getByText(/改道到回退模型/)).toBeInTheDocument();
  });

  it("renders existing entries from value prop", () => {
    const onChange = vi.fn();
    render(
      <BudgetFallbacksEditor
        value={{ "gpt-4": ["gpt-3.5-turbo", "claude-3"] }}
        onChange={onChange}
        availableModels={MODELS}
      />,
    );
    expect(screen.getByText("超出预算时，尝试")).toBeInTheDocument();
    expect(screen.getByText("主模型")).toBeInTheDocument();
    expect(screen.getByText("回退模型")).toBeInTheDocument();
  });

  it("adds a new empty entry when clicking add button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BudgetFallbacksEditor value={{}} onChange={onChange} availableModels={MODELS} />);

    await user.click(screen.getByText("添加预算回退"));
    expect(screen.getByText("主模型")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({});
  });

  it("removes an entry and emits updated dict", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <BudgetFallbacksEditor
        value={{ "gpt-4": ["gpt-3.5-turbo"], "claude-3": ["claude-haiku"] }}
        onChange={onChange}
        availableModels={MODELS}
      />,
    );

    const removeButtons = container.querySelectorAll<HTMLButtonElement>(".relative > button[type='button']");
    expect(removeButtons.length).toBe(2);

    await user.click(removeButtons[0]);
    expect(onChange).toHaveBeenLastCalledWith({ "claude-3": ["claude-haiku"] });
  });

  it("renders multiple entries for multiple fallback groups", () => {
    const onChange = vi.fn();
    render(
      <BudgetFallbacksEditor
        value={{ "gpt-4": ["claude-3"], "gpt-3.5-turbo": ["claude-haiku"] }}
        onChange={onChange}
        availableModels={MODELS}
      />,
    );
    const labels = screen.getAllByText("主模型");
    expect(labels.length).toBe(2);
  });

  it("resets internal state when remounted with empty value via key prop", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <BudgetFallbacksEditor
        key={1}
        value={{ "gpt-4": ["gpt-3.5-turbo"] }}
        onChange={onChange}
        availableModels={MODELS}
      />,
    );
    expect(screen.getAllByText("主模型").length).toBe(1);

    rerender(<BudgetFallbacksEditor key={2} value={{}} onChange={onChange} availableModels={MODELS} />);
    expect(screen.queryByText("主模型")).not.toBeInTheDocument();
    expect(screen.getByText("添加预算回退")).toBeInTheDocument();
  });

  it("shows ordering hint when multiple fallback models are configured", () => {
    const onChange = vi.fn();
    render(
      <BudgetFallbacksEditor
        value={{ "gpt-4": ["gpt-3.5-turbo", "claude-3"] }}
        onChange={onChange}
        availableModels={MODELS}
      />,
    );
    expect(screen.getByText(/仍未超出其自身预算/)).toBeInTheDocument();
  });
});
