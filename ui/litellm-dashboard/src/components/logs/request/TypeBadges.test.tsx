import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../tests/test-utils";
import { LlmBadge, McpBadge, AgentBadge, BatchBadge } from "./TypeBadges";

describe("TypeBadges", () => {
  describe("LlmBadge", () => {
    it("should render with default 'LLM' text when no count is provided", () => {
      renderWithProviders(<LlmBadge />);
      expect(screen.getByText("LLM")).toBeInTheDocument();
    });

    it("should render the count when provided", () => {
      renderWithProviders(<LlmBadge count={5} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should render count of 0 instead of default text", () => {
      renderWithProviders(<LlmBadge count={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("McpBadge", () => {
    it("should render with default 'MCP' text when no count is provided", () => {
      renderWithProviders(<McpBadge />);
      expect(screen.getByText("MCP")).toBeInTheDocument();
    });

    it("should render the count when provided", () => {
      renderWithProviders(<McpBadge count={3} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("AgentBadge", () => {
    it("should render the localized agent label when no count is provided", () => {
      renderWithProviders(<AgentBadge />);
      expect(screen.getByText("智能体")).toBeInTheDocument();
    });

    it("should render the count when provided", () => {
      renderWithProviders(<AgentBadge count={12} />);
      expect(screen.getByText("12")).toBeInTheDocument();
    });
  });

  describe("BatchBadge", () => {
    it("should render the localized batch label", () => {
      renderWithProviders(<BatchBadge />);
      expect(screen.getByText("批处理")).toBeInTheDocument();
    });
  });
});
