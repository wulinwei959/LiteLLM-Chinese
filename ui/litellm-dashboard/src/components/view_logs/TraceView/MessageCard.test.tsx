import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../tests/test-utils";
import { MessageCard, Section, ToolResultCard } from "./MessageCard";

vi.mock("./spanProvider", () => ({ useSpanProvider: () => null }));

const LONG_QUERY = "Find every invoice for the customer that was billed twice. ".repeat(3).trim();

describe("ToolResultCard", () => {
  it("expands a multiline result to its full text and keeps short results on one line", async () => {
    const user = userEvent.setup();
    const result = "line one\nline two\nTraceback: boom";
    const { unmount } = renderWithProviders(<ToolResultCard name="read_file" result={result} failed />);
    const toggle = screen.getByRole("button", { name: "展开 read_file 结果" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "折叠 read_file 结果" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText((_, el) => el?.tagName === "PRE" && el.textContent === result)).toBeVisible();

    unmount();
    renderWithProviders(<ToolResultCard name="ls" result="No files found" />);
    expect(screen.getByText("No files found")).toBeVisible();
    expect(screen.queryByRole("button", { name: /^(展开|折叠) ls 结果$/ })).not.toBeInTheDocument();
  });
});

describe("MessageCard", () => {
  it("folds the card body from the role tile and restores it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MessageCard message={{ role: "user", content: "Why was I billed twice?" }} model={null} />);
    expect(screen.getByText("Why was I billed twice?")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "折叠 用户" }));
    expect(screen.queryByText("Why was I billed twice?")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "展开 用户" }));
    expect(screen.getByText("Why was I billed twice?")).toBeVisible();
  });

  it("lists tool call args as dot rows and expands only the long value in place", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MessageCard
        message={{
          role: "assistant",
          content: "",
          tool_calls: [{ name: "search_invoices", args: { customer_id: "acme-404", query: LONG_QUERY } }],
        }}
        model={null}
      />,
    );
    expect(screen.getByText("acme-404")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "展开 customer_id" })).not.toBeInTheDocument();
    expect(screen.queryByText(LONG_QUERY, { selector: "pre" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "展开 query" }));
    expect(screen.getByRole("button", { name: "折叠 query" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(LONG_QUERY, { selector: "pre" })).toBeVisible();
  });

  it("shows a tool result as one line with the tool name and its output", () => {
    renderWithProviders(<MessageCard message={{ role: "tool", name: "ls", content: "No files found" }} model={null} />);
    expect(screen.getByText("ls")).toBeInTheDocument();
    expect(screen.getByText("No files found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "复制 ls 结果" })).toBeInTheDocument();
  });
});

describe("Section", () => {
  it("hides its body immediately when collapsed", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Section title="Output">
        <p>final answer</p>
      </Section>,
    );
    await user.click(screen.getByRole("button", { name: "Output" }));
    expect(screen.getByRole("button", { name: "Output" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("final answer")).not.toBeVisible();
  });
});
