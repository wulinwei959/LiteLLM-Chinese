import React from "react";
import { screen, waitFor, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OutputCard } from "./OutputCard";
import { ParsedMessage } from "./prettyMessagesTypes";

describe("OutputCard", () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);
  const mockMessage: ParsedMessage = {
    role: "assistant",
    content: "This is a test response",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });
  });

  it("should render the OutputCard component", () => {
    renderWithProviders(<OutputCard message={mockMessage} />);
    expect(screen.getByText("输出")).toBeInTheDocument();
  });

  it("should display the no-response placeholder when message is null", () => {
    renderWithProviders(<OutputCard message={null} />);
    expect(screen.getByText("暂无响应数据")).toBeInTheDocument();
  });

  it("should display message content when message is present", () => {
    renderWithProviders(<OutputCard message={mockMessage} />);
    expect(screen.getByText("This is a test response")).toBeInTheDocument();
  });

  it("should display ASSISTANT label when message is present", () => {
    renderWithProviders(<OutputCard message={mockMessage} />);
    expect(screen.getByText("ASSISTANT")).toBeInTheDocument();
  });

  it("should display token count when provided", () => {
    renderWithProviders(<OutputCard message={mockMessage} completionTokens={250} />);
    expect(screen.getByText(/令牌：250/)).toBeInTheDocument();
  });

  it("should display cost when provided", () => {
    renderWithProviders(<OutputCard message={mockMessage} outputCost={0.0025} />);
    expect(screen.getByText(/成本：\$0\.002500/)).toBeInTheDocument();
  });

  it("should copy message content when copy button is clicked", async () => {
    renderWithProviders(<OutputCard message={mockMessage} />);

    const copyButton = screen.getByRole("button", { name: "复制输出" });

    expect(copyButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyButton);
    });

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("This is a test response");
    });
  });

  it("should not copy when message is null and copy button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<OutputCard message={null} />);

    const copyButton = screen.getByRole("button", { name: "复制输出" });

    expect(copyButton).toBeInTheDocument();
    await user.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  it("should toggle collapse state when header is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OutputCard message={mockMessage} />);

    const header = screen.getByText("输出").closest("div");
    expect(header).toBeInTheDocument();

    const content = screen.getByText("This is a test response");
    expect(content).toBeInTheDocument();
    expect(content).toBeVisible();

    if (header) {
      await user.click(header);
      await waitFor(() => {
        expect(content).not.toBeVisible();
      });
    }
  });

  it("should handle empty content in message", () => {
    const messageWithEmptyContent: ParsedMessage = {
      role: "assistant",
      content: "",
    };
    renderWithProviders(<OutputCard message={messageWithEmptyContent} />);
    expect(screen.getByText("输出")).toBeInTheDocument();
  });

  it("should handle tool calls in message", () => {
    const messageWithToolCalls: ParsedMessage = {
      role: "assistant",
      content: "I'll call a function",
      toolCalls: [
        {
          id: "call-1",
          name: "get_weather",
          arguments: { location: "San Francisco" },
        },
      ],
    };
    renderWithProviders(<OutputCard message={messageWithToolCalls} />);
    expect(screen.getByText("I'll call a function")).toBeInTheDocument();
  });

  it("should display both token count and cost when both are provided", () => {
    renderWithProviders(<OutputCard message={mockMessage} completionTokens={300} outputCost={0.003} />);
    expect(screen.getByText(/令牌：300/)).toBeInTheDocument();
    expect(screen.getByText(/成本：\$0\.003000/)).toBeInTheDocument();
  });

  it("should handle collapse toggle when message is null", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OutputCard message={null} />);

    const header = screen.getByText("输出").closest("div");
    expect(header).toBeInTheDocument();

    const noDataText = screen.getByText("暂无响应数据");
    expect(noDataText).toBeInTheDocument();
    expect(noDataText).toBeVisible();

    if (header) {
      await user.click(header);
      await waitFor(() => {
        expect(noDataText).not.toBeVisible();
      });
    }
  });
});
