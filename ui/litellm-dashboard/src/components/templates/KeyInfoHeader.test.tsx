import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KeyInfoHeader, KeyInfoData } from "./KeyInfoHeader";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const MOCK_DATA: KeyInfoData = {
  keyName: "My Test Key",
  keyId: "sk-9876543210fedcba",
  userId: "user-abc-123",
  userEmail: "test@example.com",
  userAlias: null,
  teamId: "team-xyz-789",
  teamAlias: "Platform Team",
  orgId: "org-abc-001",
  orgAlias: "Acme Org",
  createdBy: "admin@example.com",
  createdById: "admin-user-456",
  createdAt: "Oct 29, 2025 at 1:26 AM",
  lastUpdated: "Oct 29, 2025 at 1:47 AM",
  lastActive: "Oct 29, 2025 at 2:00 AM",
  expires: "Never",
};

describe("KeyInfoHeader", () => {
  it("should render", () => {
    renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
    expect(screen.getByText("My Test Key")).toBeInTheDocument();
  });

  it("should render the key ID with prefix", () => {
    renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
    expect(screen.getByText(/密钥 ID：/)).toBeInTheDocument();
    expect(screen.getByText(/sk-9876543210fedcba/)).toBeInTheDocument();
  });

  it("should render all metadata fields", () => {
    renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
    expect(screen.getByText("用户")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("创建时间")).toBeInTheDocument();
    expect(screen.getByText("创建人")).toBeInTheDocument();
    expect(screen.getByText("过期时间")).toBeInTheDocument();
    expect(screen.getByText("最后更新")).toBeInTheDocument();
    expect(screen.getByText("最近活跃")).toBeInTheDocument();
    expect(screen.getByText("团队")).toBeInTheDocument();
    expect(screen.getByText("组织")).toBeInTheDocument();
  });

  describe("entity links", () => {
    it("links the user to the users page", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("link", { name: "test@example.com" })).toHaveAttribute(
        "href",
        expect.stringContaining("/users?user=user-abc-123"),
      );
    });

    it("links the creator to the users page by user id, not by the displayed alias", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("link", { name: "admin@example.com" })).toHaveAttribute(
        "href",
        expect.stringContaining("/users?user=admin-user-456"),
      );
    });

    it("shows the team alias and links it to the team page by id", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("link", { name: "Platform Team" })).toHaveAttribute(
        "href",
        expect.stringContaining("/teams?team=team-xyz-789"),
      );
    });

    it("falls back to the team id when no alias is known", () => {
      renderWithProviders(<KeyInfoHeader data={{ ...MOCK_DATA, teamAlias: null }} />);
      expect(screen.getByRole("link", { name: "team-xyz-789" })).toHaveAttribute(
        "href",
        expect.stringContaining("/teams?team=team-xyz-789"),
      );
    });

    it("shows the organization alias and links it to the organization page by id", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("link", { name: "Acme Org" })).toHaveAttribute(
        "href",
        expect.stringContaining("/organizations?org=org-abc-001"),
      );
    });

    it("renders '-' without a link when the key has no organization", () => {
      renderWithProviders(<KeyInfoHeader data={{ ...MOCK_DATA, orgId: "", orgAlias: null }} />);
      expect(screen.queryByRole("link", { name: /org/i })).not.toBeInTheDocument();
      expect(screen.getByText("组织").parentElement?.parentElement).toHaveTextContent("-");
    });

    it("renders '-' without a link when the key has no team", () => {
      renderWithProviders(<KeyInfoHeader data={{ ...MOCK_DATA, teamId: "", teamAlias: null }} />);
      expect(screen.queryByRole("link", { name: /team/i })).not.toBeInTheDocument();
      expect(screen.getByText("团队").parentElement?.parentElement).toHaveTextContent("-");
    });

    it("does not link the user when the key has no user id", () => {
      renderWithProviders(<KeyInfoHeader data={{ ...MOCK_DATA, userId: "", userEmail: "orphan@example.com" }} />);
      expect(screen.getByText("orphan@example.com")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "orphan@example.com" })).not.toBeInTheDocument();
    });

    it("keeps the Default Proxy Admin creator unlinked", () => {
      renderWithProviders(
        <KeyInfoHeader data={{ ...MOCK_DATA, createdBy: "default_user_id", createdById: "default_user_id" }} />,
      );
      expect(screen.getByText("默认代理管理员")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /default/i })).not.toBeInTheDocument();
    });
  });

  describe("back button", () => {
    it("should render with default text", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("button", { name: /返回密钥列表/ })).toBeInTheDocument();
    });

    it("should render with custom text", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} backButtonText="Back to Dashboard" />);
      expect(screen.getByRole("button", { name: /back to dashboard/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /返回密钥列表/ })).not.toBeInTheDocument();
    });

    it("should call onBack when clicked", async () => {
      const onBack = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onBack={onBack} />);
      await userEvent.click(screen.getByRole("button", { name: /返回密钥列表/ }));
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("action buttons", () => {
    it("should show Regenerate button and actions dropdown by default", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("button", { name: /重新生成密钥/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "更多密钥操作" })).toBeInTheDocument();
    });

    it("should hide Regenerate button and actions dropdown when canModifyKey is false", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} canModifyKey={false} />);
      expect(screen.queryByRole("button", { name: /重新生成密钥/ })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "更多密钥操作" })).not.toBeInTheDocument();
    });

    it("should call onRegenerate when Regenerate Key is clicked", async () => {
      const onRegenerate = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onRegenerate={onRegenerate} />);
      await userEvent.click(screen.getByRole("button", { name: /重新生成密钥/ }));
      expect(onRegenerate).toHaveBeenCalledTimes(1);
    });

    it("should disable Regenerate button when regenerateDisabled is true", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} regenerateDisabled={true} />);
      expect(screen.getByRole("button", { name: /重新生成密钥/ })).toBeDisabled();
    });

    it("should not disable Regenerate button by default", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByRole("button", { name: /重新生成密钥/ })).toBeEnabled();
    });
  });

  describe("destructive actions dropdown", () => {
    const openDropdown = async () => {
      await userEvent.click(screen.getByRole("button", { name: "更多密钥操作" }));
    };

    it("should list Block Key, Reset Spend, and Delete Key when all handlers are provided", async () => {
      renderWithProviders(
        <KeyInfoHeader data={MOCK_DATA} onToggleBlocked={vi.fn()} onResetSpend={vi.fn()} onDelete={vi.fn()} />,
      );
      await openDropdown();
      expect(await screen.findByRole("menuitem", { name: "封禁密钥" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "重置支出" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "删除密钥" })).toBeInTheDocument();
    });

    it("should omit Block Key and Reset Spend when their handlers are not provided", async () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onDelete={vi.fn()} />);
      await openDropdown();
      expect(await screen.findByRole("menuitem", { name: "删除密钥" })).toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "封禁密钥" })).not.toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "重置支出" })).not.toBeInTheDocument();
    });

    it("should show Unblock Key instead of Block Key when the key is blocked", async () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onToggleBlocked={vi.fn()} isBlocked />);
      await openDropdown();
      expect(await screen.findByRole("menuitem", { name: "解除封禁密钥" })).toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "封禁密钥" })).not.toBeInTheDocument();
    });

    it("should call onToggleBlocked when Block Key is clicked", async () => {
      const onToggleBlocked = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onToggleBlocked={onToggleBlocked} />);
      await openDropdown();
      await userEvent.click(await screen.findByRole("menuitem", { name: "封禁密钥" }));
      expect(onToggleBlocked).toHaveBeenCalledTimes(1);
    });

    it("should call onToggleBlocked when Unblock Key is clicked", async () => {
      const onToggleBlocked = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onToggleBlocked={onToggleBlocked} isBlocked />);
      await openDropdown();
      await userEvent.click(await screen.findByRole("menuitem", { name: "解除封禁密钥" }));
      expect(onToggleBlocked).toHaveBeenCalledTimes(1);
    });

    it("should call onResetSpend when Reset Spend is clicked", async () => {
      const onResetSpend = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onResetSpend={onResetSpend} />);
      await openDropdown();
      await userEvent.click(await screen.findByRole("menuitem", { name: "重置支出" }));
      expect(onResetSpend).toHaveBeenCalledTimes(1);
    });

    it("should call onDelete when Delete Key is clicked", async () => {
      const onDelete = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onDelete={onDelete} />);
      await openDropdown();
      await userEvent.click(await screen.findByRole("menuitem", { name: "删除密钥" }));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("blocked tag", () => {
    it("should show a Blocked tag when isBlocked is true", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} isBlocked />);
      expect(screen.getByText("已封禁")).toBeInTheDocument();
    });

    it("should not show a Blocked tag by default", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.queryByText("已封禁")).not.toBeInTheDocument();
    });
  });

  describe("Create New Key button", () => {
    it("should show when onCreateNew is provided", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onCreateNew={vi.fn()} />);
      expect(screen.getByRole("button", { name: "新建密钥" })).toBeInTheDocument();
    });

    it("should hide when onCreateNew is not provided", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.queryByRole("button", { name: "新建密钥" })).not.toBeInTheDocument();
    });

    it("should call onCreateNew when clicked", async () => {
      const onCreateNew = vi.fn();
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} onCreateNew={onCreateNew} />);
      await userEvent.click(screen.getByRole("button", { name: "新建密钥" }));
      expect(onCreateNew).toHaveBeenCalledTimes(1);
    });
  });

  describe("default_user_id handling", () => {
    it("should show Default Proxy Admin tag for User when userId is default_user_id and no alias/email", () => {
      const data = { ...MOCK_DATA, userId: "default_user_id", userEmail: "", userAlias: null };
      renderWithProviders(<KeyInfoHeader data={data} />);
      expect(screen.getAllByText("默认代理管理员").length).toBeGreaterThanOrEqual(1);
    });

    it("should show Default Proxy Admin tag for Created By when value is default_user_id", () => {
      const data = { ...MOCK_DATA, createdBy: "default_user_id" };
      renderWithProviders(<KeyInfoHeader data={data} />);
      expect(screen.getAllByText("默认代理管理员").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("User field fallbacks", () => {
    it("should display userAlias as primary when set, overriding email and userId", () => {
      const data = { ...MOCK_DATA, userAlias: "alice" };
      renderWithProviders(<KeyInfoHeader data={data} />);
      expect(screen.getByText("alice")).toBeInTheDocument();
      expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
    });

    it("should display userEmail when alias is null", () => {
      renderWithProviders(<KeyInfoHeader data={MOCK_DATA} />);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should fall back to userId when alias and email are missing", () => {
      const data = { ...MOCK_DATA, userEmail: "", userAlias: null };
      renderWithProviders(<KeyInfoHeader data={data} />);
      expect(screen.getByText("user-abc-123")).toBeInTheDocument();
    });

    it("should show '-' when alias, email, and userId are all empty", () => {
      const data = { ...MOCK_DATA, userId: "", userEmail: "", userAlias: null };
      renderWithProviders(<KeyInfoHeader data={data} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });
});
