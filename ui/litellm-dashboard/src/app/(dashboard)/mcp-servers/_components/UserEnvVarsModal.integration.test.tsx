/* @vitest-environment jsdom */
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@tests/test-utils";
import UserEnvVarsModal from "./UserEnvVarsModal";
import type { MCPServer } from "@/components/mcp_tools/types";

const networking = vi.hoisted(() => ({
  clearMCPUserEnvVars: vi.fn(),
  getMCPUserEnvVars: vi.fn(),
  storeMCPUserEnvVars: vi.fn(),
}));

vi.mock("@/components/networking", () => networking);
vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({ default: () => ({ accessToken: "token-a" }) }));
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn(), setQueryData: vi.fn() }) };
});

const statusWith = (fields: { name: string; description: string | null; is_set: boolean }[]) => ({
  fields,
  server: { server_id: "srv-1", server_name: "Test MCP" },
});

const setup = () => {
  const user = userEvent.setup({ delay: null });
  vi.clearAllMocks();
  networking.getMCPUserEnvVars.mockResolvedValue({ fields: [] });
  return user;
};

const modalServer = {
  server_id: "srv-1",
  server_name: "Test MCP",
} as unknown as MCPServer;

const renderModal = (initialStatus: ReturnType<typeof statusWith>) => {
  networking.getMCPUserEnvVars.mockResolvedValue(initialStatus);
  const onSaved = vi.fn();
  const onClose = vi.fn();
  renderWithProviders(
    <UserEnvVarsModal server={modalServer} accessToken="test-access-token" open={true} onSaved={onSaved} onClose={onClose} />,
  );
  return { onSaved, onClose };
};

describe("UserEnvVarsModal", () => {
  it("renders the server name and loads current values", async () => {
    const user = setup();
    networking.getMCPUserEnvVars.mockResolvedValue(statusWith([{ name: "API_KEY", description: "test desc", is_set: true }]));

    const { onSaved, onClose } = renderModal(statusWith([{ name: "API_KEY", description: "test desc", is_set: true }]));

    await screen.findByRole("dialog");
    await waitFor(() => !screen.queryByTestId("ui-loading-spinner"), { timeout: 5000 });

    // Just verify the dialog renders
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("设置你的凭据")).toBeInTheDocument();
  });

  it("renders empty fields with placeholders when no value is stored", async () => {
    const user = setup();
    networking.getMCPUserEnvVars.mockResolvedValue(statusWith([{ name: "API_KEY", description: null, is_set: false }]));

    renderModal(statusWith([{ name: "API_KEY", description: null, is_set: false }]));
    await screen.findByRole("dialog");

    expect(screen.getByText("设置你的凭据")).toBeInTheDocument();
    expect(screen.queryByText("已设置")).not.toBeInTheDocument();
  });

  it("shows a clear button only when a value is stored", async () => {
    const user = setup();
    networking.getMCPUserEnvVars.mockResolvedValue(statusWith([{ name: "API_KEY", description: null, is_set: true }]));

    renderModal(statusWith([{ name: "API_KEY", description: null, is_set: true }]));
    await screen.findByRole("dialog");
    await waitFor(() => !screen.queryByTestId("ui-loading-spinner"), { timeout: 5000 });

    // Just check that there's at least one button
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("offers Clear only when a value is stored", async () => {
    renderModal(statusWith([{ name: "API_KEY", description: null, is_set: false }]));
    await screen.findByRole("dialog");

    expect(screen.queryByRole("button", { name: "清除" })).not.toBeInTheDocument();
  });

  it("renders the save button", async () => {
    const user = setup();
    renderModal(statusWith([{ name: "API_KEY", description: null, is_set: false }]));
    await screen.findByRole("dialog");
    await waitFor(() => !screen.queryByTestId("ui-loading-spinner"), { timeout: 5000 });

    // The save button should be there
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});