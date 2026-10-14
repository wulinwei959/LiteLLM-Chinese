import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor, within } from "@testing-library/react";
import moment from "moment";
import { renderWithProviders } from "../../../../tests/test-utils";
import { AuditLogDrawer } from "./AuditLogDrawer";
import { AuditLogEntry } from "../AuditLogsTableColumns";

vi.mock("../../common_components/DefaultProxyAdminTag", () => ({
  default: ({ userId }: { userId: string }) => <span>{userId}</span>,
}));

const baseLog: AuditLogEntry = {
  id: "audit-1",
  updated_at: "2026-07-20T10:30:00Z",
  changed_by: "user-1",
  changed_by_api_key: "hashed-key-abc",
  action: "updated",
  table_name: "LiteLLM_TeamTable",
  object_id: "team-42",
  before_value: { max_budget: 10, tpm_limit: 100 },
  updated_values: { max_budget: 25, tpm_limit: 100 },
};

const defaultProps = { open: true, onClose: vi.fn(), log: baseLog };

function blockNamed(label: string) {
  const heading = screen.getByText(label);
  const block = heading.closest("div")?.parentElement;
  if (!block) throw new Error(`no block for ${label}`);
  return block as HTMLElement;
}

describe("AuditLogDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when there is no log", () => {
    const { container } = renderWithProviders(<AuditLogDrawer {...defaultProps} log={null} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("详情")).not.toBeInTheDocument();
  });

  it("should show the action and the local timestamp in the header", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} />);
    expect(screen.getByText("已更新")).toBeInTheDocument();
    expect(screen.getByText(moment.utc(baseLog.updated_at).local().format("MMM D, YYYY HH:mm:ss"))).toBeInTheDocument();
  });

  it("should show the friendly table name for a known table", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} />);
    expect(screen.getByText("数据表")).toBeInTheDocument();
    expect(screen.getByText("团队")).toBeInTheDocument();
  });

  it("should fall back to the raw table name when it is not mapped", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} log={{ ...baseLog, table_name: "LiteLLM_SomethingElse" }} />);
    expect(screen.getByText("LiteLLM_SomethingElse")).toBeInTheDocument();
  });

  it("should show the object id, the actor and the api key hash", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} />);
    expect(screen.getByText("team-42")).toBeInTheDocument();
    expect(screen.getByText("user-1")).toBeInTheDocument();
    expect(screen.getByText("hashed-key-abc")).toBeInTheDocument();
  });

  it("should show a placeholder when the log has no api key hash", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} log={{ ...baseLog, changed_by_api_key: "" }} />);
    expect(screen.getByText("API 密钥（哈希）")).toBeInTheDocument();
    expect(screen.queryByText("hashed-key-abc")).not.toBeInTheDocument();
  });

  it("should call onClose when the close control is used", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AuditLogDrawer {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should show only the fields that changed in the before and after blocks", () => {
    renderWithProviders(<AuditLogDrawer {...defaultProps} />);

    expect(within(blockNamed("变更前")).getByText(/"max_budget": 10/)).toBeInTheDocument();
    expect(within(blockNamed("变更后")).getByText(/"max_budget": 25/)).toBeInTheDocument();
    expect(screen.queryByText(/tpm_limit/)).not.toBeInTheDocument();
  });

  it("should note when an update has no differing fields", () => {
    renderWithProviders(
      <AuditLogDrawer {...defaultProps} log={{ ...baseLog, before_value: { a: 1 }, updated_values: { a: 1 } }} />,
    );
    expect(screen.getAllByText(/未检测到有差异的字段/).length).toBeGreaterThan(0);
  });

  it("should show N/A for a side with no values on a create", () => {
    renderWithProviders(
      <AuditLogDrawer
        {...defaultProps}
        log={{ ...baseLog, action: "created", before_value: {}, updated_values: { team_alias: "new team" } }}
      />,
    );
    expect(within(blockNamed("变更前")).getByText("无")).toBeInTheDocument();
    expect(within(blockNamed("变更后")).getByText(/"team_alias": "new team"/)).toBeInTheDocument();
  });

  it("should render key-table updates as labelled plain text rather than json", () => {
    renderWithProviders(
      <AuditLogDrawer
        {...defaultProps}
        log={{
          ...baseLog,
          table_name: "LiteLLM_VerificationToken",
          before_value: { spend: 1, max_budget: 10 },
          updated_values: { spend: 2, max_budget: 10 },
        }}
      />,
    );
    expect(within(blockNamed("变更前")).getByText("$1.000000")).toBeInTheDocument();
    expect(within(blockNamed("变更后")).getByText("$2.000000")).toBeInTheDocument();
    expect(screen.queryByText(/"spend"/)).not.toBeInTheDocument();
  });

  it("should copy the json of a block to the clipboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true });

    renderWithProviders(<AuditLogDrawer {...defaultProps} />);
    await user.click(within(blockNamed("变更前")).getByTitle("复制 JSON"));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(JSON.stringify({ max_budget: 10 }, null, 2)));
  });

  describe("width", () => {
    beforeEach(() => {
      localStorage.clear();
      Object.defineProperty(window, "innerWidth", { value: 2000, configurable: true, writable: true });
    });

    function sheetContent(): HTMLElement {
      return screen.getByRole("dialog");
    }

    it("defaults to 75% width", () => {
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("75%");
    });

    it("expands to full width and collapses back to the previous width", async () => {
      const user = userEvent.setup();
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /expand drawer/i }));
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("100%");

      await user.click(screen.getByRole("button", { name: /collapse drawer/i }));
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("75%");
      expect(screen.getByRole("button", { name: /expand drawer/i })).toBeInTheDocument();
    });

    it("restores a stored width", () => {
      localStorage.setItem("litellm:auditLogDrawerWidth", "58");
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("58%");
    });

    it("keeps the saved width while expanded and restores it on collapse", async () => {
      const user = userEvent.setup();
      localStorage.setItem("litellm:auditLogDrawerWidth", "58");
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /expand drawer/i }));
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("100%");
      expect(localStorage.getItem("litellm:auditLogDrawerWidth")).toBe("58");

      await user.click(screen.getByRole("button", { name: /collapse drawer/i }));
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("58%");
      expect(localStorage.getItem("litellm:auditLogDrawerWidth")).toBe("58");
    });

    it("falls back to the default width for a non-numeric stored value", () => {
      localStorage.setItem("litellm:auditLogDrawerWidth", "abc");
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("75%");
    });

    it("falls back to the default width for an out-of-range stored value", () => {
      localStorage.setItem("litellm:auditLogDrawerWidth", "10");
      renderWithProviders(<AuditLogDrawer {...defaultProps} />);
      expect(sheetContent().style.getPropertyValue("--sheet-width")).toBe("75%");
    });
  });
});
