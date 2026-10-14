import React from "react";
import { screen, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import MCPConnect from "./mcp_connect";

vi.mock("@/components/networking", () => ({
  getProxyBaseUrl: vi.fn().mockReturnValue("http://localhost:4000"),
}));

const activePanel = () => screen.getByRole("tabpanel");

describe("MCPConnect (tab mount contract)", () => {
  it("keeps the x-mcp-servers header toggle on after switching tabs away and back", async () => {
    render(<MCPConnect />);

    await userEvent.click(screen.getByRole("tab", { name: "LiteLLM 代理" }));
    expect(within(activePanel()).queryByText(/"x-mcp-servers":/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("switch"));
    expect(within(activePanel()).getByText(/"x-mcp-servers": "Zapier_MCP,dev-group"/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Cursor" }));
    await userEvent.click(screen.getByRole("tab", { name: "LiteLLM 代理" }));

    expect(screen.getByRole("switch")).toBeChecked();
    expect(within(activePanel()).getByText(/"x-mcp-servers": "Zapier_MCP,dev-group"/)).toBeInTheDocument();
  });

  it("renders the Cursor steps with their shortcut values interpolated", async () => {
    render(<MCPConnect />);

    await userEvent.click(screen.getByRole("tab", { name: "Cursor" }));

    expect(within(activePanel()).getByText("打开 Cursor 设置")).toBeInTheDocument();
    expect(within(activePanel()).getByText("前往 MCP 工具标签页")).toBeInTheDocument();
    expect(within(activePanel()).getByText("添加配置")).toBeInTheDocument();
    expect(
      within(activePanel()).getByText("使用快捷键 ⇧+⌘+J（Mac）或 Ctrl+Shift+J（Windows/Linux）"),
    ).toBeInTheDocument();
    expect(within(activePanel()).queryByText(/\{mac\}/)).not.toBeInTheDocument();
  });
});
