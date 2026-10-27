import React from "react";
import { screen, waitFor, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InputCard } from "./InputCard";
import { ParsedMessage } from "./prettyMessagesTypes";
import { copyToClipboard } from "@/utils/dataUtils";
import { toast } from "@/lib/toast";

vi.mock("@/utils/dataUtils", () => ({ copyToClipboard: vi.fn() }));

describe("InputCard", () => {
  const mockMessages: ParsedMessage[] = [
    {
      role: "user",
      content: "Hello, how are you?",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(copyToClipboard).mockResolvedValue(true);
  });

  it("should render the InputCard component", () => {
    renderWithProviders(<InputCard messages={mockMessages} />);
    expect(screen.getByText("输入")).toBeInTheDocument();
  });

  it("should return null when messages array is empty", () => {
    const { container } = renderWithProviders(<InputCard messages={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should display system message when present", () => {
    const messagesWithSystem: ParsedMessage[] = [
      {
        role: "system",
        content: "You are a helpful assistant",
      },
      {
        role: "user",
        content: "Hello",
      },
    ];
    renderWithProviders(<InputCard messages={messagesWithSystem} />);
    expect(screen.getByText("系统")).toBeInTheDocument();
    expect(screen.getByText("You are a helpful assistant")).toBeInTheDocument();
  });

  it("should display history messages when present", () => {
    const messagesWithHistory: ParsedMessage[] = [
      {
        role: "user",
        content: "First message",
      },
      {
        role: "assistant",
        content: "Response",
      },
      {
        role: "user",
        content: "Last message",
      },
    ];
    renderWithProviders(<InputCard messages={messagesWithHistory} />);
    expect(screen.getByText("Last message")).toBeInTheDocument();
  });

  it("should display last message content", () => {
    const messages: ParsedMessage[] = [
      {
        role: "user",
        content: "What is the weather?",
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    expect(screen.getByText("What is the weather?")).toBeInTheDocument();
  });

  it("should display token count when provided", () => {
    renderWithProviders(<InputCard messages={mockMessages} promptTokens={150} />);
    expect(screen.getByText(/令牌：150/)).toBeInTheDocument();
  });

  it("should display cost when provided", () => {
    renderWithProviders(<InputCard messages={mockMessages} inputCost={0.0015} />);
    expect(screen.getByText(/成本：\$0\.001500/)).toBeInTheDocument();
  });

  it("should copy last message content when copy button is clicked", async () => {
    const messages: ParsedMessage[] = [
      {
        role: "user",
        content: "Copy this text",
      },
    ];

    renderWithProviders(<InputCard messages={messages} />);

    const copyButton = screen.getByRole("button", { name: "复制输入" });

    expect(copyButton).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(copyToClipboard).toHaveBeenCalledWith("Copy this text", "Input copied");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should toggle collapse state when header is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InputCard messages={mockMessages} />);

    const header = screen.getByText("输入").closest("div");
    expect(header).toBeInTheDocument();

    const content = screen.getByText("Hello, how are you?");
    expect(content).toBeInTheDocument();
    expect(content).toBeVisible();

    if (header) {
      await user.click(header);
      await waitFor(() => {
        expect(content).not.toBeVisible();
      });
    }
  });

  it("should handle messages without system message", () => {
    const messages: ParsedMessage[] = [
      {
        role: "user",
        content: "User message only",
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    expect(screen.queryByText("系统")).not.toBeInTheDocument();
    expect(screen.getByText("User message only")).toBeInTheDocument();
  });

  it("should handle messages with only system message", () => {
    const messages: ParsedMessage[] = [
      {
        role: "system",
        content: "System only",
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    expect(screen.getByText("系统")).toBeInTheDocument();
    expect(screen.getByText("System only")).toBeInTheDocument();
  });

  it("should display last message role label correctly", () => {
    const messages: ParsedMessage[] = [
      {
        role: "assistant",
        content: "Assistant response",
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    expect(screen.getByText("助手")).toBeInTheDocument();
    expect(screen.getByText("Assistant response")).toBeInTheDocument();
  });

  it("should handle tool calls in last message", () => {
    const messages: ParsedMessage[] = [
      {
        role: "user",
        content: "Call a function",
        toolCalls: [
          {
            id: "call-1",
            name: "get_weather",
            arguments: { location: "NYC" },
          },
        ],
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    expect(screen.getByText("Call a function")).toBeInTheDocument();
  });

  it("should handle empty content in last message", () => {
    const messages: ParsedMessage[] = [
      {
        role: "user",
        content: "",
      },
    ];
    renderWithProviders(<InputCard messages={messages} />);
    const copyButton = screen.getByRole("button", { name: "复制输入" });
    expect(copyButton).toBeInTheDocument();
  });
});
