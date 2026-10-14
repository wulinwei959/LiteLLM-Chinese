import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { HistoryTree } from "./HistoryTree";
import { ParsedMessage } from "./prettyMessagesTypes";

describe("HistoryTree", () => {
  it("should return null when messages array is empty", () => {
    const { container } = renderWithProviders(<HistoryTree messages={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render message count with 复数"条消息" for multiple messages', () => {
    const messages: ParsedMessage[] = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
      { role: "user", content: "How are you?" },
    ];
    renderWithProviders(<HistoryTree messages={messages} />);
    expect(screen.getByText("历史（3 条消息）")).toBeInTheDocument();
  });

  it('should render message count with 单数"条消息" for one message', () => {
    const messages: ParsedMessage[] = [{ role: "user", content: "Hello" }];
    renderWithProviders(<HistoryTree messages={messages} />);
    expect(screen.getByText("历史（1 条消息）")).toBeInTheDocument();
  });

  it("should expand and show messages when header is clicked", async () => {
    const user = userEvent.setup();
    const messages: ParsedMessage[] = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ];
    renderWithProviders(<HistoryTree messages={messages} />);

    // Click to expand
    await user.click(screen.getByText("历史（2 条消息）"));

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("should expand with Enter and collapse with Space from the keyboard", async () => {
    const user = userEvent.setup();
    const messages: ParsedMessage[] = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ];
    renderWithProviders(<HistoryTree messages={messages} />);

    expect(screen.getByText("Hello")).not.toBeVisible();

    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Hello")).toBeVisible();

    await user.keyboard(" ");
    expect(screen.getByText("Hello")).not.toBeVisible();
  });
});
