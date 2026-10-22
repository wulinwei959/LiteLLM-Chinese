import { act } from "@testing-library/react";
import { renderWithProviders, screen, waitFor } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MCPServer, MCPSubmissionsSummary } from "@/components/mcp_tools/types";
import { fetchMCPSubmissions, getGeneralSettingsCall, updateConfigFieldSetting } from "@/components/networking";
import { MCPSubmissionsTab } from "./MCPSubmissionsTab";

vi.mock("@/components/networking", () => ({
  approveMCPServer: vi.fn(),
  fetchMCPSubmissions: vi.fn(),
  getGeneralSettingsCall: vi.fn(),
  rejectMCPServer: vi.fn(),
  updateConfigFieldSetting: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), fromError: vi.fn() },
}));

const token = "token";

const pendingSubmission: MCPServer = {
  server_id: "submission-1",
  server_name: "submission",
  alias: "Submission server",
  description: "A server with required details",
  url: "https://example.com/mcp",
  transport: "http",
  auth_type: "none",
  approval_status: "pending_review",
  created_at: "2026-01-01T00:00:00Z",
  created_by: "user",
  updated_at: "2026-01-01T00:00:00Z",
  updated_by: "user",
};

const submissionSummary: MCPSubmissionsSummary = {
  total: 1,
  pending_review: 1,
  active: 0,
  rejected: 0,
  items: [pendingSubmission],
};

const configuredRules = [
  {
    field_name: "mcp_required_fields",
    field_type: "List",
    field_value: ["description", "url", "alias"],
    field_description: "Required MCP submission fields",
    stored_in_db: true,
  },
];

describe("MCPSubmissionsTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchMCPSubmissions).mockResolvedValue(submissionSummary);
    vi.mocked(getGeneralSettingsCall).mockResolvedValue(configuredRules);
    vi.mocked(updateConfigFieldSetting).mockResolvedValue(undefined);
  });

  it("renders configured submission rules and card compliance checks", async () => {
    renderWithProviders(<MCPSubmissionsTab accessToken={token} />);

    expect(await screen.findByText("（3 个必填字段）")).toBeInTheDocument();
    expect(screen.queryByText("未设置规则")).not.toBeInTheDocument();
    expect(screen.getByText("3 项通过，0 项未通过")).toBeInTheDocument();
    expect(screen.getAllByText("通过", { selector: "span.text-xs" })).toHaveLength(3);
  });

  it("preloads the rules editor and preserves them when adding a field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MCPSubmissionsTab accessToken={token} />);

    await user.click(await screen.findByText("提交规则"));

    expect(screen.getByRole("checkbox", { name: /描述/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /服务器 URL/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /别名/ })).toBeChecked();
    const authTypeCheckbox = screen.getByRole("checkbox", { name: /已配置认证/ });
    expect(authTypeCheckbox).not.toBeChecked();

    await user.click(authTypeCheckbox);
    await user.click(screen.getByRole("button", { name: "保存规则" }));

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "token", "mcp_required_fields", [
        "description",
        "url",
        "alias",
        "auth_type",
      ]),
    );
  });

  it("keeps the rules editor disabled until saved rules load", async () => {
    const user = userEvent.setup();
    const { promise: settingsPromise, resolve: resolveSettings } =
      Promise.withResolvers<Awaited<ReturnType<typeof getGeneralSettingsCall>>>();
    vi.mocked(getGeneralSettingsCall).mockReturnValue(settingsPromise);

    renderWithProviders(<MCPSubmissionsTab accessToken={token} />);
    await user.click(screen.getByText("提交规则"));

    const descriptionCheckbox = screen.getByRole("checkbox", { name: /描述/ });
    const serverUrlCheckbox = screen.getByRole("checkbox", { name: /服务器 URL/ });
    const aliasCheckbox = screen.getByRole("checkbox", { name: /别名/ });
    const authTypeCheckbox = screen.getByRole("checkbox", { name: /已配置认证/ });
    const saveRulesButton = screen.getByRole("button", { name: "保存规则" });

    expect(descriptionCheckbox).toBeDisabled();
    expect(serverUrlCheckbox).toBeDisabled();
    expect(aliasCheckbox).toBeDisabled();
    expect(authTypeCheckbox).toBeDisabled();
    expect(saveRulesButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "取消" })).toBeEnabled();

    await act(async () => {
      resolveSettings(configuredRules);
    });

    expect(descriptionCheckbox).toBeEnabled();
    expect(serverUrlCheckbox).toBeEnabled();
    expect(aliasCheckbox).toBeEnabled();
    expect(authTypeCheckbox).toBeEnabled();
    expect(descriptionCheckbox).toBeChecked();
    expect(serverUrlCheckbox).toBeChecked();
    expect(aliasCheckbox).toBeChecked();
    expect(authTypeCheckbox).not.toBeChecked();
    expect(saveRulesButton).toBeEnabled();
  });

  it("shows no rules when the general settings array is empty", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([]);

    renderWithProviders(<MCPSubmissionsTab accessToken={token} />);

    expect(await screen.findByText("未设置规则")).toBeInTheDocument();
  });
});
