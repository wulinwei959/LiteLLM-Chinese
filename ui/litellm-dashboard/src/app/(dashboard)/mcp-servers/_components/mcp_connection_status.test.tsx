import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import MCPConnectionStatus from "./mcp_connection_status";

describe("MCPConnectionStatus", () => {
  const defaultProps = {
    formValues: { url: "https://example.com/mcp" },
    tools: [] as any[],
    isLoadingTools: false,
    toolsError: null,
    toolsErrorStackTrace: null,
    canFetchTools: false,
    fetchTools: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when canFetchTools is false and no URL is set", () => {
    const { container } = renderWithProviders(<MCPConnectionStatus {...defaultProps} formValues={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should show 'Complete required fields' message when URL is set but canFetchTools is false", () => {
    renderWithProviders(<MCPConnectionStatus {...defaultProps} />);
    expect(screen.getByText(/请填写必填项以测试连接/i)).toBeInTheDocument();
  });

  it("should show 'Connection successful' when tools are loaded", () => {
    renderWithProviders(<MCPConnectionStatus {...defaultProps} canFetchTools={true} tools={[{ name: "tool1" }]} />);
    expect(screen.getByText("连接成功")).toBeInTheDocument();
    expect(screen.getByText("已连接")).toBeInTheDocument();
  });

  it("should show loading state when isLoadingTools is true", () => {
    renderWithProviders(<MCPConnectionStatus {...defaultProps} canFetchTools={true} isLoadingTools={true} />);
    expect(screen.getByText(/正在测试与 MCP 服务器的连接/i)).toBeInTheDocument();
    expect(screen.getByText("正在连接...")).toBeInTheDocument();
  });

  it("should show info message without retry when tool preview returns 403", () => {
    renderWithProviders(
      <MCPConnectionStatus
        {...defaultProps}
        canFetchTools={true}
        toolsError="Tool preview is not available for submissions. Tools will be verified by an admin during review."
        toolsErrorStatus={403}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/Tools will be verified by an admin during review/i);
    expect(screen.queryByRole("alert")).not.toHaveTextContent("连接失败");
    expect(screen.queryByRole("button", { name: /重试/i })).not.toBeInTheDocument();
  });

  it("should show error state with retry button when toolsError is set", async () => {
    const fetchTools = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <MCPConnectionStatus
        {...defaultProps}
        canFetchTools={true}
        toolsError="Connection refused"
        fetchTools={fetchTools}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("连接失败");
    expect(screen.getByText("Connection refused")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /重试/i }));
    expect(fetchTools).toHaveBeenCalled();
  });

  it("should show 'No tools found' when connection succeeds but no tools returned", () => {
    renderWithProviders(<MCPConnectionStatus {...defaultProps} canFetchTools={true} tools={[]} />);
    expect(screen.getByText(/此 MCP 服务器未找到任何工具/i)).toBeInTheDocument();
  });
});
