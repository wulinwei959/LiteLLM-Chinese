import { act, fireEvent, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import MoyaiChatHome from "./MoyaiChatHome";
import { renderWithProviders } from "../../../../tests/test-utils";
import type { Conversation } from "../types";

function homeProps(overrides: Partial<ComponentProps<typeof MoyaiChatHome>> = {}) {
  return {
    children: <span>Chat composer</span>,
    imageMode: false,
    draft: "",
    busy: false,
    conversations: [],
    onSelectConversation: vi.fn(),
    onPrompt: vi.fn(),
    ...overrides,
  };
}

function conversation(id: string, updatedAt: number): Conversation {
  return { id, title: `Chat ${id}`, model: "chat-model", messages: [], mcpServerNames: [], createdAt: 1, updatedAt };
}

describe("MoyaiChatHome", () => {
  it("should render the Moyai welcome and composer", () => {
    renderWithProviders(<MoyaiChatHome {...homeProps()} />);
    expect(screen.getByRole("heading", { level: 1, name: "我们要 创建什么？" })).toBeInTheDocument();
    expect(screen.getByText("Chat composer")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "最近聊天" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("此浏览器还没有最近聊天");
  });

  it("should show the three most recently updated chats and open the selected one", () => {
    const conversations = [
      conversation("first", 1),
      conversation("second", 4),
      conversation("third", 3),
      conversation("fourth", 2),
    ];
    const props = homeProps({ conversations });
    renderWithProviders(<MoyaiChatHome {...props} />);
    const recent = screen.getByRole("region", { name: "最近聊天" });
    const buttons = within(recent).getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["Chat second", "Chat third", "Chat fourth"]);
    expect(screen.queryByRole("button", { name: "Chat first" })).not.toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Chat third" }));
    });
    expect(props.onSelectConversation).toHaveBeenCalledWith("third");
    expect(conversations.map((item) => item.id)).toEqual(["first", "second", "third", "fourth"]);
  });

  it("should pass a starter prompt to the composer without submitting it", () => {
    const props = homeProps();
    renderWithProviders(<MoyaiChatHome {...props} />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /审查代码/ }));
    });
    expect(props.onPrompt).toHaveBeenCalledWith("帮我审查改动中的 bug 与可改进之处。");
    expect(props.onSelectConversation).not.toHaveBeenCalled();
  });

  it("should disable starters during a request", () => {
    const props = homeProps({ busy: true });
    renderWithProviders(<MoyaiChatHome {...props} />);
    const starter = screen.getByRole("button", { name: /审查代码/ });
    expect(starter).toBeDisabled();
    act(() => {
      fireEvent.click(starter);
    });
    expect(props.onPrompt).not.toHaveBeenCalled();
  });

  it("should hide starter choices from assistive technology once a draft is present", () => {
    renderWithProviders(<MoyaiChatHome {...homeProps({ draft: "My current prompt" })} />);
    expect(screen.queryByRole("group", { name: "从提示词开始" })).not.toBeInTheDocument();
    for (const button of screen.getAllByRole("button", { hidden: true })) expect(button).toBeDisabled();
  });

  it("should show the image welcome without code starter prompts in image mode", () => {
    renderWithProviders(<MoyaiChatHome {...homeProps({ imageMode: true })} />);
    expect(screen.getByRole("heading", { level: 1, name: "我们要创建什么？" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "从提示词开始" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /审查代码/ })).not.toBeInTheDocument();
  });
});
