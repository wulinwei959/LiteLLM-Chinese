import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../../tests/test-utils";
import ReasoningContent from "./ReasoningContent";

describe("ReasoningContent", () => {
  it("should render nothing when reasoningContent is empty", () => {
    const { container } = renderWithProviders(<ReasoningContent reasoningContent="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should show reasoning content expanded by default and toggle on click", () => {
    renderWithProviders(<ReasoningContent reasoningContent="thinking hard" />);

    expect(screen.getByText("thinking hard")).toBeInTheDocument();
    expect(screen.getByText("收起推理过程")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("thinking hard")).not.toBeInTheDocument();
    expect(screen.getByText("展开推理过程")).toBeInTheDocument();
  });

  it("should constrain width and break long words so it cannot expand the layout (regression #32481)", () => {
    const longToken = "a".repeat(500);
    renderWithProviders(<ReasoningContent reasoningContent={longToken} />);

    const contentBox = screen.getByText(longToken).closest("div.mt-2");
    expect(contentBox).not.toBeNull();
    expect(contentBox).toHaveClass("max-w-full");
    expect(contentBox).toHaveStyle({ wordBreak: "break-word", overflowWrap: "break-word" });
  });
});
