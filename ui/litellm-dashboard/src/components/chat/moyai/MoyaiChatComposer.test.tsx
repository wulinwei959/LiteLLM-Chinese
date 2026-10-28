import { act, createEvent, fireEvent, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import MoyaiChatComposer from "./MoyaiChatComposer";
import { renderWithProviders } from "../../../../tests/test-utils";

function composerProps(overrides: Partial<ComponentProps<typeof MoyaiChatComposer>> = {}) {
  return {
    value: "Explain this code",
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    placeholder: "Describe a change, paste an error, or ask a question…",
    isLoading: false,
    submitDisabled: false,
    submitLabel: "发送",
    ...overrides,
  };
}

describe("MoyaiChatComposer", () => {
  it("should render the message input with attachment previews and tools", () => {
    const props = composerProps({
      attachmentPreview: <span role="img" aria-label="Attached design" />,
      tools: <span>Attach an image</span>,
      modelPicker: <span>Choose a model</span>,
    });
    renderWithProviders(<MoyaiChatComposer {...props} />);
    expect(screen.getByRole("textbox", { name: "消息" })).toHaveValue("Explain this code");
    expect(screen.getByRole("img", { name: "Attached design" })).toBeInTheDocument();
    expect(screen.getByText("Attach an image")).toBeInTheDocument();
    expect(screen.getByText("Choose a model")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "发送" })).toBeEnabled();
  });

  it("should forward draft changes and submit on Enter", () => {
    const props = composerProps();
    renderWithProviders(<MoyaiChatComposer {...props} />);
    const editor = screen.getByRole("textbox", { name: "消息" });
    act(() => {
      fireEvent.change(editor, { target: { value: "New prompt" } });
    });
    expect(props.onChange).toHaveBeenCalledWith("New prompt");
    const enter = createEvent.keyDown(editor, { key: "Enter", code: "Enter" });
    act(() => {
      fireEvent(editor, enter);
    });
    expect(enter.defaultPrevented).toBe(true);
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it("should keep Shift+Enter available for a new line", () => {
    const props = composerProps();
    renderWithProviders(<MoyaiChatComposer {...props} />);
    const editor = screen.getByRole("textbox", { name: "消息" });
    const enter = createEvent.keyDown(editor, { key: "Enter", code: "Enter", shiftKey: true });
    act(() => {
      fireEvent(editor, enter);
    });
    expect(enter.defaultPrevented).toBe(false);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("should let IME composition consume Enter without submitting", () => {
    const props = composerProps();
    renderWithProviders(<MoyaiChatComposer {...props} />);
    const editor = screen.getByRole("textbox", { name: "消息" });
    const enter = createEvent.keyDown(editor, { key: "Enter", code: "Enter", isComposing: true });
    act(() => {
      fireEvent(editor, enter);
    });
    expect(enter.defaultPrevented).toBe(false);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("should block both click and Enter submission while submission is disabled", () => {
    const props = composerProps({ submitDisabled: true });
    renderWithProviders(<MoyaiChatComposer {...props} />);
    const send = screen.getByRole("button", { name: "发送" });
    expect(send).toBeDisabled();
    act(() => {
      fireEvent.click(send);
    });
    act(() => {
      fireEvent.keyDown(screen.getByRole("textbox", { name: "消息" }), { key: "Enter" });
    });
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it("should stop an active request and prevent another Enter submission", () => {
    const props = composerProps({ isLoading: true });
    renderWithProviders(<MoyaiChatComposer {...props} />);
    expect(screen.queryByRole("button", { name: "发送" })).not.toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(screen.getByRole("textbox", { name: "消息" }), { key: "Enter" });
    });
    expect(props.onSubmit).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "停止请求" }));
    });
    expect(props.onCancel).toHaveBeenCalledOnce();
  });

  it("should forward pasted files to the attachment handler", () => {
    const onPaste = vi.fn();
    const props = composerProps({ onPaste });
    renderWithProviders(<MoyaiChatComposer {...props} />);
    const image = new File(["image"], "design.png", { type: "image/png" });
    const clipboardData = { files: [image], items: [{ kind: "file", type: "image/png", getAsFile: () => image }] };
    act(() => {
      fireEvent.paste(screen.getByRole("textbox", { name: "消息" }), { clipboardData });
    });
    expect(onPaste).toHaveBeenCalledOnce();
    expect(onPaste.mock.calls[0][0].clipboardData).toBe(clipboardData);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });
});
