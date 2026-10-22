import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MCPNetworkSettings from "./MCPNetworkSettings";
import { toast } from "@/lib/toast";
import {
  getGeneralSettingsCall,
  updateConfigFieldSetting,
  deleteConfigFieldSetting,
  fetchMCPClientIp,
} from "@/components/networking";

vi.mock("@/components/networking", () => ({
  getGeneralSettingsCall: vi.fn(),
  updateConfigFieldSetting: vi.fn(),
  deleteConfigFieldSetting: vi.fn(),
  fetchMCPClientIp: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), fromError: vi.fn() },
}));

const renderSettings = () => render(<MCPNetworkSettings accessToken="tok" />);

const ANTIGRAVITY = { alias: "Antigravity CLI", value: "antigravity-cli" };
const CODEX = { alias: "Codex", value: "codex-mcp-client" };

const clientCard = (alias: string) => screen.getByRole("button", { name: new RegExp(`^${alias}`) });

const fillClientDialog = async (alias: string, value: string) => {
  const dialog = await screen.findByRole("dialog");
  fireEvent.change(within(dialog).getByRole("textbox", { name: "别名" }), { target: { value: alias } });
  fireEvent.change(within(dialog).getByRole("textbox", { name: "值" }), { target: { value } });
  return dialog;
};

const addClient = async (alias: string, value: string) => {
  await userEvent.click(screen.getByRole("button", { name: "添加客户端" }));
  const dialog = await fillClientDialog(alias, value);
  await userEvent.click(within(dialog).getByRole("button", { name: "添加" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
};

describe("MCPNetworkSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([]);
    vi.mocked(fetchMCPClientIp).mockResolvedValue(null);
    vi.mocked(updateConfigFieldSetting).mockResolvedValue(undefined);
    vi.mocked(deleteConfigFieldSetting).mockResolvedValue(undefined);
  });

  it("renders the stored private ranges once settings load", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_internal_ip_ranges", field_value: ["10.0.0.0/8", "192.168.0.0/16"] },
    ]);

    renderSettings();

    expect(await screen.findByText("10.0.0.0/8")).toBeInTheDocument();
    expect(screen.getByText("192.168.0.0/16")).toBeInTheDocument();
  });

  it("ignores unrelated config fields", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "some_other_setting", field_value: ["should-not-show"] },
    ]);

    renderSettings();

    await screen.findByText("私有 IP 段");
    expect(screen.queryByText("should-not-show")).not.toBeInTheDocument();
  });

  it("suggests the caller's /24 range from the detected client IP", async () => {
    vi.mocked(fetchMCPClientIp).mockResolvedValue("203.0.113.45");

    renderSettings();

    expect(await screen.findByText(/您当前的 IP：203\.0\.113\.45/)).toBeInTheDocument();
    expect(screen.getByText("203.0.113.0/24")).toBeInTheDocument();
  });

  it("exposes the suggested range as a control a keyboard user can reach and activate", async () => {
    vi.mocked(fetchMCPClientIp).mockResolvedValue("203.0.113.45");

    renderSettings();
    const suggested = await screen.findByRole("button", { name: /203\.0\.113\.0\/24/ });

    suggested.focus();
    expect(suggested).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(screen.queryByText("建议的网段：")).not.toBeInTheDocument());
  });

  it("adds the suggested range to the list when clicked, and stops suggesting it", async () => {
    vi.mocked(fetchMCPClientIp).mockResolvedValue("203.0.113.45");

    renderSettings();
    await userEvent.click(await screen.findByText("203.0.113.0/24"));

    await waitFor(() => expect(screen.queryByText("建议的网段：")).not.toBeInTheDocument());
    expect(screen.getByText("203.0.113.0/24")).toBeInTheDocument();
  });

  it("saves the configured ranges once they change", async () => {
    vi.mocked(fetchMCPClientIp).mockResolvedValue("203.0.113.45");
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_internal_ip_ranges", field_value: ["10.0.0.0/8"] },
    ]);

    renderSettings();
    await userEvent.click(await screen.findByText("203.0.113.0/24"));
    await userEvent.click(await screen.findByRole("button", { name: /Save|保存/ }));

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_internal_ip_ranges", [
        "10.0.0.0/8",
        "203.0.113.0/24",
      ]),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_internal_ip_ranges");
  });

  it("clears a stored range setting instead of saving an empty list", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_internal_ip_ranges", field_value: ["10.0.0.0/8"] },
    ]);

    renderSettings();
    await userEvent.click(await screen.findByRole("button", { name: "移除 10.0.0.0/8" }));
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_internal_ip_ranges"),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("does not write settings that were never stored and are still empty", async () => {
    renderSettings();
    await userEvent.click(await screen.findByRole("button", { name: /Save|保存/ }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MCP 网络设置已保存"));
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("loads both capability switches on and writes nothing on Save when the proxy reports no stored value", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_disabled_capabilities", field_value: null },
    ]);
    renderSettings();
    const switches = await screen.findAllByRole("switch");
    expect(switches.map((s) => s.getAttribute("aria-checked"))).toEqual(["true", "true"]);
    await userEvent.click(screen.getByRole("button", { name: /保存|Save/ }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MCP 网络设置已保存"));
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("stores the capabilities an admin switches off", async () => {
    renderSettings();
    await userEvent.click((await screen.findAllByRole("switch"))[0]);
    await userEvent.click(screen.getByRole("button", { name: /保存|Save/ }));

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_disabled_capabilities", ["prompts"]),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("deletes the stored setting when the admin switches the last disabled capability back on", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_disabled_capabilities", field_value: ["resources"] },
    ]);
    renderSettings();
    const switches = await screen.findAllByRole("switch");
    expect(switches.map((s) => s.getAttribute("aria-checked"))).toEqual(["true", "false"]);
    await userEvent.click(switches[1]);
    await userEvent.click(screen.getByRole("button", { name: /保存|Save/ }));

    await waitFor(() => expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_disabled_capabilities"));
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("labels the section Allowed Clients and renders each stored client as a card showing alias and value", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY, CODEX] },
    ]);

    renderSettings();

    expect(await screen.findByText("允许的客户端")).toBeVisible();
    expect(screen.queryByText(/Allowed Client IDs/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Allowed Client Applications/)).not.toBeInTheDocument();
    expect(clientCard("Antigravity CLI")).toHaveTextContent("antigravity-cli");
    expect(clientCard("Codex")).toHaveTextContent("codex-mcp-client");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens an edit dialog when a client card is clicked, prefilled with that client's alias and value", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY, CODEX] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(clientCard("Codex"));

    const dialog = await screen.findByRole("dialog", { name: "编辑客户端" });
    expect(within(dialog).getByRole("textbox", { name: "别名" })).toHaveValue("Codex");
    expect(within(dialog).getByRole("textbox", { name: "值" })).toHaveValue("codex-mcp-client");
  });

  it("warns that a stored allowlist in the old plain-string shape denies every client and lets Save remove it", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: ["antigravity-cli"] },
    ]);

    renderSettings();

    expect(
      await screen.findByText(/存储的允许列表不是别名与值的配对列表|stored allowlist is not a list/),
    ).toBeVisible();
    expect(screen.queryByText("antigravity-cli")).not.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients"),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText(/stored allowlist is not a list/)).not.toBeInTheDocument());
  });

  it("replaces a stored allowlist in the old plain-string shape with the clients the admin adds", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: ["antigravity-cli"] },
    ]);

    renderSettings();

    await screen.findByText(/存储的允许列表不是别名与值的配对列表|stored allowlist is not a list/);
    await addClient(ANTIGRAVITY.alias, ANTIGRAVITY.value);
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        ANTIGRAVITY,
      ]),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients");
    await waitFor(() => expect(screen.queryByText(/stored allowlist is not a list/)).not.toBeInTheDocument());
  });

  it("treats a stored entry with an empty alias or value as denying every client, like the gateway does", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY, { alias: "", value: "claude-code" }] },
    ]);

    renderSettings();

    expect(
      await screen.findByText(/存储的允许列表不是别名与值的配对列表|stored allowlist is not a list/),
    ).toBeVisible();
    expect(screen.queryByRole("button", { name: /^Antigravity CLI/ })).not.toBeInTheDocument();
  });

  it("adds clients as alias and value pairs and saves them under mcp_allowed_clients", async () => {
    renderSettings();
    await screen.findByText("允许的客户端");

    await addClient(" Antigravity CLI ", " antigravity-cli ");
    await addClient("Codex", "codex-mcp-client");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        ANTIGRAVITY,
        CODEX,
      ]),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients");
  });

  it("edits a stored client's value through its dialog and saves the new value", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(clientCard("Antigravity CLI"));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "值" }), {
      target: { value: " 0oa1b2c3d4e5f6g7h8i9 " },
    });
    await userEvent.click(within(dialog).getByRole("button", { name: "完成" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(clientCard("Antigravity CLI")).toHaveTextContent("0oa1b2c3d4e5f6g7h8i9");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        { alias: "Antigravity CLI", value: "0oa1b2c3d4e5f6g7h8i9" },
      ]),
    );
  });

  it("keeps a stored client untouched when its dialog is cancelled", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(clientCard("Antigravity CLI"));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "值" }), { target: { value: "changed" } });
    await userEvent.click(within(dialog).getByRole("button", { name: "取消" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(clientCard("Antigravity CLI")).toHaveTextContent("antigravity-cli");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MCP 网络设置已保存"));
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("will not add a client that has an alias but no value", async () => {
    renderSettings();
    await screen.findByText("允许的客户端");

    await userEvent.click(screen.getByRole("button", { name: "添加客户端" }));
    const dialog = await fillClientDialog("Antigravity CLI", "   ");

    expect(within(dialog).getByRole("button", { name: "添加" })).toBeDisabled();
  });

  it("adds nothing when the add dialog is cancelled", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(screen.getByRole("button", { name: "添加客户端" }));
    const dialog = await fillClientDialog("Codex", "codex-mcp-client");
    await userEvent.click(within(dialog).getByRole("button", { name: "取消" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("Codex")).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MCP 网络设置已保存"));
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("removes the right client from the middle of the list", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      {
        field_name: "mcp_allowed_clients",
        field_value: [ANTIGRAVITY, { alias: "Claude Code", value: "claude-code" }, CODEX],
      },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(clientCard("Claude Code"));
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "移除客户端" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("claude-code")).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        ANTIGRAVITY,
        CODEX,
      ]),
    );
  });

  it("removes a client and clears the setting when the list becomes empty", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_allowed_clients", field_value: [{ alias: "Claude Code", value: "claude-code" }] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await userEvent.click(clientCard("Claude Code"));
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "移除客户端" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("claude-code")).not.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients"),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalledWith(
      expect.any(Function),
      "tok",
      "mcp_allowed_clients",
      expect.anything(),
    );
  });

  it("warns that a stored empty allowlist denies every client and lets Save remove it", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([{ field_name: "mcp_allowed_clients", field_value: [] }]);

    renderSettings();

    expect(await screen.findByText(/当前存储了空的允许列表，因此所有客户端都会被拒绝/)).toBeVisible();

    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients"),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText(/当前存储了空的允许列表/)).not.toBeInTheDocument());
  });

  it("does not show the deny-all warning when no allowlist is stored", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([{ field_name: "mcp_allowed_clients", field_value: null }]);

    renderSettings();

    await screen.findByText("允许的客户端");
    expect(screen.queryByText(/every client is denied/)).not.toBeInTheDocument();
  });

  it("explains that JWT callers are identified by the configured claim and others by the opt-in header", async () => {
    renderSettings();

    expect(await screen.findByText(/litellm_jwtauth\.mcp_client_id_jwt_field/)).toBeVisible();
    expect(screen.getByText(/该值由客户端自行选择，因此是策略控制/)).toBeVisible();
    expect(screen.queryByText(/clientInfo/)).not.toBeInTheDocument();
  });

  it("renders the stored client identity header once settings load", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_client_id_header", field_value: "x-mcp-client" },
    ]);

    renderSettings();

    expect(await screen.findByRole("textbox", { name: "客户端身份请求头（安全性较低）" })).toHaveValue("x-mcp-client");
  });

  it("saves a newly typed client identity header under mcp_client_id_header", async () => {
    renderSettings();
    fireEvent.change(await screen.findByRole("textbox", { name: "客户端身份请求头（安全性较低）" }), {
      target: { value: " x-mcp-client " },
    });

    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(
        expect.any(Function),
        "tok",
        "mcp_client_id_header",
        "x-mcp-client",
      ),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalledWith(
      expect.any(Function),
      "tok",
      "mcp_allowed_clients",
      expect.anything(),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("clears a stored client identity header when the field is emptied, so only JWT identity is trusted", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_client_id_header", field_value: "x-mcp-client" },
    ]);

    renderSettings();
    fireEvent.change(await screen.findByRole("textbox", { name: "客户端身份请求头（安全性较低）" }), {
      target: { value: "" },
    });

    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(deleteConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_client_id_header"),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("does not rewrite an unchanged client identity header on save", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_client_id_header", field_value: "x-mcp-client" },
    ]);

    renderSettings();
    await screen.findByRole("textbox", { name: "客户端身份请求头（安全性较低）" });
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(updateConfigFieldSetting).not.toHaveBeenCalled();
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("keeps the private ranges and the allowed clients as independent settings on save", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_internal_ip_ranges", field_value: ["10.0.0.0/8"] },
      { field_name: "mcp_allowed_clients", field_value: [ANTIGRAVITY] },
    ]);

    renderSettings();
    await screen.findByText("允许的客户端");
    await addClient("Codex", "codex-mcp-client");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        ANTIGRAVITY,
        CODEX,
      ]),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalledWith(
      expect.any(Function),
      "tok",
      "mcp_internal_ip_ranges",
      expect.anything(),
    );
    expect(deleteConfigFieldSetting).not.toHaveBeenCalled();
  });

  it("still saves the allowed clients when the private range write fails, and reports the failure", async () => {
    vi.mocked(getGeneralSettingsCall).mockResolvedValue([
      { field_name: "mcp_internal_ip_ranges", field_value: ["10.0.0.0/8"] },
    ]);
    const rangeFailure = new Error("Field name=mcp_internal_ip_ranges not in config");
    vi.mocked(deleteConfigFieldSetting).mockRejectedValue(rangeFailure);

    renderSettings();
    await userEvent.click(await screen.findByRole("button", { name: "移除 10.0.0.0/8" }));
    await addClient("Codex", "codex-mcp-client");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        CODEX,
      ]),
    );
    await waitFor(() => expect(toast.fromError).toHaveBeenCalledWith(rangeFailure));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("writes the private ranges and the allowed clients one after the other, never concurrently", async () => {
    vi.mocked(fetchMCPClientIp).mockResolvedValue("203.0.113.45");
    let finishRangeWrite: (() => void) | undefined;
    vi.mocked(updateConfigFieldSetting).mockImplementation(
      (_t, _token, fieldName) =>
        new Promise<void>((resolve) => {
          if (fieldName === "mcp_internal_ip_ranges") {
            finishRangeWrite = resolve;
          } else {
            resolve();
          }
        }),
    );

    renderSettings();
    await userEvent.click(await screen.findByText("203.0.113.0/24"));
    await addClient("Codex", "codex-mcp-client");
    await userEvent.click(screen.getAllByRole("button", { name: /Save|保存/ })[0]);

    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_internal_ip_ranges", [
        "203.0.113.0/24",
      ]),
    );
    expect(updateConfigFieldSetting).not.toHaveBeenCalledWith(
      expect.any(Function),
      "tok",
      "mcp_allowed_clients",
      expect.anything(),
    );

    finishRangeWrite?.();
    await waitFor(() =>
      expect(updateConfigFieldSetting).toHaveBeenCalledWith(expect.any(Function), "tok", "mcp_allowed_clients", [
        CODEX,
      ]),
    );
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MCP 网络设置已保存"));
  });
});
