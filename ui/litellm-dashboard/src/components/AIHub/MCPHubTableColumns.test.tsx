import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { renderWithProviders } from "../../../tests/test-utils";
import { getMCPHubTableColumns, MCPServerData } from "./MCPHubTableColumns";

const SERVER_URL = "https://mcp.exa.ai/mcp";

const mockServer: MCPServerData = {
  server_id: "server-1",
  server_name: "exa_test",
  description: "Fast, intelligent web search and web crawling",
  url: SERVER_URL,
  transport: "http",
  auth_type: "none",
  created_at: "2026-01-01T00:00:00Z",
  created_by: "admin",
  updated_at: "2026-01-01T00:00:00Z",
  updated_by: "admin",
  teams: [],
  mcp_access_groups: [],
  allowed_tools: [],
  extra_headers: [],
  mcp_info: {},
  static_headers: {},
  status: "active",
  args: [],
  env: {},
};

function MCPHubTableHarness({
  data,
  onServerClick,
  columnsRef,
}: {
  data: MCPServerData[];
  onServerClick: (server: MCPServerData) => void;
  columnsRef?: { current: ColumnDef<MCPServerData>[] | null };
}) {
  const t = useTranslations("modelHub");
  const commonT = useTranslations("common");
  const columns = useMemo(() => getMCPHubTableColumns({ onServerClick, t, commonT }), [onServerClick, t, commonT]);
  useEffect(() => {
    if (columnsRef) columnsRef.current = columns;
  }, [columns, columnsRef]);
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(server) => server.server_id}
      sortingMode="client"
      size="compact"
    />
  );
}

function renderTable(
  onServerClick = vi.fn(),
  servers = [mockServer],
  columnsRef?: { current: ColumnDef<MCPServerData>[] | null },
) {
  renderWithProviders(<MCPHubTableHarness data={servers} onServerClick={onServerClick} columnsRef={columnsRef} />);
  return onServerClick;
}

describe("getMCPHubTableColumns", () => {
  it("explains the limited check for a reachable server", async () => {
    const user = userEvent.setup();
    renderTable(vi.fn(), [{ ...mockServer, status: "reachable" }]);

    await user.hover(screen.getByText("reachable"));

    expect(await screen.findByText("Server responded. Authentication and tools were not checked")).toBeInTheDocument();
  });

  it("renders the server row", () => {
    renderTable();
    expect(screen.getByText("exa_test")).toBeInTheDocument();
  });

  it("keeps the non-sensitive columns", () => {
    renderTable();
    expect(screen.getByText("服务器名称")).toBeInTheDocument();
    expect(screen.getByText("传输方式")).toBeInTheDocument();
    expect(screen.getByText("认证类型")).toBeInTheDocument();
  });

  it("shows hub membership separately from the network setting", () => {
    renderTable(vi.fn(), [
      { ...mockServer, available_on_public_internet: false, mcp_info: { is_public: true } },
      {
        ...mockServer,
        server_id: "network-only",
        server_name: "Network-only server",
        available_on_public_internet: true,
        mcp_info: { is_public: false },
      },
    ]);

    expect(screen.getByText("中心列表")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /exa_test/ })).getByText("已列出")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Network-only server/ })).getByText("未列出")).toBeInTheDocument();
  });

  it("does not expose a URL column", () => {
    const columnsRef: { current: ColumnDef<MCPServerData>[] | null } = { current: null };
    renderTable(vi.fn(), [mockServer], columnsRef);
    expect(screen.queryByText("URL")).not.toBeInTheDocument();
    const columns = columnsRef.current ?? [];
    expect(columns.some((c) => c.header === "URL" || c.meta?.title === "URL")).toBe(false);
  });

  it("does not render the server url anywhere in the table", () => {
    renderTable();
    expect(screen.queryByText(SERVER_URL)).not.toBeInTheDocument();
  });

  it("opens the server details when the name is clicked", async () => {
    const user = userEvent.setup();
    const onServerClick = renderTable();
    await user.click(screen.getByRole("button", { name: "exa_test" }));
    expect(onServerClick).toHaveBeenCalledWith(mockServer);
  });

  it("opens the server details from the actions menu", async () => {
    const user = userEvent.setup();
    const onServerClick = renderTable();
    await user.click(screen.getByRole("button", { name: "打开 MCP 服务器操作菜单" }));
    const detailsItem = await screen.findByTestId("mcp-hub-action-details");
    expect(detailsItem).toHaveTextContent("查看详情");
    await user.click(detailsItem);
    expect(onServerClick).toHaveBeenCalledWith(mockServer);
  });

  it("copies the server name from the actions menu", async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(screen.getByTestId("mcp-hub-actions-server-1"));
    const copyItem = await screen.findByTestId("mcp-hub-action-copy");
    expect(copyItem).toHaveTextContent("复制服务器名称");
    await user.click(copyItem);
    expect(await window.navigator.clipboard.readText()).toBe("exa_test");
  });
});
