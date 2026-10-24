import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders, testQueryClient } from "../../../../../tests/test-utils";
import { MCPToolsetsTab } from "./MCPToolsetsTab";
import * as networking from "@/components/networking";
import { useMCPToolsets } from "@/app/(dashboard)/hooks/mcpServers/useMCPToolsets";
import { useMCPServers } from "@/app/(dashboard)/hooks/mcpServers/useMCPServers";
import { MCPToolset } from "@/components/mcp_tools/types";

vi.mock("@/components/networking", () => ({
  createMCPToolset: vi.fn(),
  updateMCPToolset: vi.fn(),
  deleteMCPToolset: vi.fn(),
  listMCPTools: vi.fn(),
  getProxyBaseUrl: vi.fn().mockReturnValue("https://backend.example.com"),
  getGatewayBaseUrl: vi.fn().mockReturnValue("https://gateway.example.com"),
}));

vi.mock("@/app/(dashboard)/hooks/mcpServers/useMCPToolsets", () => ({ useMCPToolsets: vi.fn() }));
vi.mock("@/app/(dashboard)/hooks/mcpServers/useMCPServers", () => ({ useMCPServers: vi.fn() }));

const setup = () => userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

const renderTab = (toolsets: MCPToolset[] = []) => {
  vi.mocked(useMCPToolsets).mockReturnValue({
    data: toolsets,
    isLoading: false,
  } as unknown as ReturnType<typeof useMCPToolsets>);
  vi.mocked(useMCPServers).mockReturnValue({ data: [] } as unknown as ReturnType<typeof useMCPServers>);
  renderWithProviders(<MCPToolsetsTab accessToken="sk-test" userRole="Admin" />);
};

const expectButtonInDialog = async (name: string) => {
  const button = await screen.findByRole("button", { name });
  if (button.closest('[role="dialog"]') === null) {
    throw new Error(`no dialog contains a "${name}" button`);
  }
};

const openEditFor = async (user: ReturnType<typeof setup>) => {
  await user.click(await screen.findByRole("button", { name: "打开工具集操作" }));
  await user.click(await screen.findByRole("menuitem", { name: "编辑" }));
  await expectButtonInDialog("保存更改");
};

const openCreate = async (user: ReturnType<typeof setup>) => {
  await user.click(screen.getByRole("button", { name: /新建工具集|new toolset/i }));
  await expectButtonInDialog("创建工具集");
};

describe("MCPToolsetsTab create/edit toolset form", () => {
  beforeEach(() => {
    // testQueryClient is a module singleton with staleTime Infinity, so without
    // this a test overriding the toolsets query would render the previous cache.
    testQueryClient.clear();
    vi.clearAllMocks();
  });

  it("creates a toolset with the typed name, description and no tools", async () => {
    const user = setup();
    vi.mocked(networking.createMCPToolset).mockResolvedValue(
      {} as Awaited<ReturnType<typeof networking.createMCPToolset>>,
    );
    renderTab();

    const dialog = await openCreate(user);
    fireEvent.change(screen.getByPlaceholderText("例如 github-linear-tools"), {
      target: { value: "github-linear-tools" },
    });
    fireEvent.change(screen.getByPlaceholderText("可选的描述"), { target: { value: "tools for triage" } });
    await user.click(screen.getByRole("button", { name: "创建工具集" }));

    await waitFor(() => {
      expect(networking.createMCPToolset).toHaveBeenCalledWith("sk-test", {
        toolset_name: "github-linear-tools",
        description: "tools for triage",
        tools: [],
      });
    });
    expect(networking.createMCPToolset).toHaveBeenCalledTimes(1);
  });

  it("sends an empty string when the description is left untouched", async () => {
    const user = setup();
    vi.mocked(networking.createMCPToolset).mockResolvedValue(
      {} as Awaited<ReturnType<typeof networking.createMCPToolset>>,
    );
    renderTab();

    const dialog = await openCreate(user);
    fireEvent.change(screen.getByPlaceholderText("例如 github-linear-tools"), { target: { value: "solo" } });
    await user.click(screen.getByRole("button", { name: "创建工具集" }));

    await waitFor(() => {
      expect(networking.createMCPToolset).toHaveBeenCalledWith("sk-test", {
        toolset_name: "solo",
        description: "",
        tools: [],
      });
    });
  });

  it("blocks the submit and shows the required message when the name is empty", async () => {
    const user = setup();
    renderTab();

    const dialog = await openCreate(user);
    await user.click(screen.getByRole("button", { name: "创建工具集" }));

    expect(await screen.findByText("请输入工具集名称")).toBeInTheDocument();
    expect(networking.createMCPToolset).not.toHaveBeenCalled();
  });

  it("does not treat a whitespace-only description as absent", async () => {
    const user = setup();
    vi.mocked(networking.createMCPToolset).mockResolvedValue(
      {} as Awaited<ReturnType<typeof networking.createMCPToolset>>,
    );
    renderTab();

    const dialog = await openCreate(user);
    fireEvent.change(screen.getByPlaceholderText("例如 github-linear-tools"), { target: { value: "spaced" } });
    fireEvent.change(screen.getByPlaceholderText("可选的描述"), { target: { value: "  " } });
    await user.click(screen.getByRole("button", { name: "创建工具集" }));

    await waitFor(() => {
      expect(networking.createMCPToolset).toHaveBeenCalledWith("sk-test", {
        toolset_name: "spaced",
        description: "  ",
        tools: [],
      });
    });
  });

  it("seeds the edit form from the toolset and updates it by id", async () => {
    const user = setup();
    vi.mocked(networking.updateMCPToolset).mockResolvedValue(
      {} as Awaited<ReturnType<typeof networking.updateMCPToolset>>,
    );
    const toolset = {
      toolset_id: "ts-1",
      toolset_name: "existing",
      description: "old description",
      tools: [{ server_id: "srv-1", tool_name: "search" }],
    } as MCPToolset;
    renderTab([toolset]);

    const dialog = await openEditFor(user);
    const name = await screen.findByDisplayValue("existing");
    expect(name).toBe(screen.getByPlaceholderText("例如 github-linear-tools"));
    expect(screen.getByText("工具集名称")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("可选的描述")).toHaveValue("old description");

    await user.clear(name);
    fireEvent.change(name, { target: { value: "renamed" } });
    await user.click(screen.getAllByRole("button", { name: "保存更改" })[0]);

    const expectedUpdate = {
      toolset_id: "ts-1",
      toolset_name: "renamed",
      description: "old description",
      tools: [{ server_id: "srv-1", tool_name: "search" }],
    };
    await waitFor(() => {
      expect(networking.updateMCPToolset).toHaveBeenCalledWith("sk-test", expectedUpdate);
    });
  });

  it("seeds an absent description as an empty string rather than failing", async () => {
    const user = setup();
    vi.mocked(networking.updateMCPToolset).mockResolvedValue(
      {} as Awaited<ReturnType<typeof networking.updateMCPToolset>>,
    );
    const toolset = {
      toolset_id: "ts-2",
      toolset_name: "no-desc",
      description: null,
      tools: [],
    } as unknown as MCPToolset;
    renderTab([toolset]);

    const dialog = await openEditFor(user);
    await screen.findByDisplayValue("no-desc");
    expect(screen.getByPlaceholderText("可选的描述")).toHaveValue("");

    await user.click(screen.getAllByRole("button", { name: "保存更改" })[0]);

    const expectedUpdate = { toolset_id: "ts-2", toolset_name: "no-desc", description: "", tools: [] };
    await waitFor(() => {
      expect(networking.updateMCPToolset).toHaveBeenCalledWith("sk-test", expectedUpdate);
    });
  });
});

describe("MCPToolsetsTab usage guide", () => {
  it("shows the toolset URL on the gateway host", () => {
    renderTab();

    expect(screen.getByText(/https:\/\/gateway\.example\.com\/toolset\/<toolset-name>\/mcp/)).toBeInTheDocument();
  });
});
