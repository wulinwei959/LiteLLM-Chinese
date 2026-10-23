/* @vitest-environment jsdom */
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { renderWithProviders } from "../../../../tests/test-utils";
import { recordUiEvent } from "@/lib/telemetry/uiEvents";
import ModelsAndEndpointsPage from "./page";

vi.mock("@/lib/telemetry/uiEvents", () => ({ recordUiEvent: vi.fn(() => Promise.resolve()) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/ui/models-and-endpoints" }));

vi.mock("./panels/AllModelsPanel", () => ({ default: () => <div data-testid="panel-all-models" /> }));
vi.mock("./panels/AddModelPanel", () => ({ default: () => <div data-testid="panel-add" /> }));
vi.mock("./panels/AutoRoutersTabPanel", () => ({ default: () => <div data-testid="panel-auto-routers" /> }));
vi.mock("./panels/LlmCredentialsPanel", () => ({ default: () => <div data-testid="panel-credentials" /> }));
vi.mock("./panels/PassThroughPanel", () => ({ default: () => <div data-testid="panel-pass-through" /> }));
vi.mock("./panels/HealthStatusPanel", () => ({ default: () => <div data-testid="panel-health" /> }));
vi.mock("./panels/ModelRetrySettingsPanel", () => ({ default: () => <div data-testid="panel-retry" /> }));
vi.mock("./panels/ModelGroupAliasPanel", () => ({ default: () => <div data-testid="panel-alias" /> }));
vi.mock("./panels/PriceDataPanel", () => ({ default: () => <div data-testid="panel-price" /> }));
vi.mock("./panels/AccessGroupBudgetsPanel", () => ({ default: () => <div data-testid="panel-budgets" /> }));

const detailState = { modelId: null as string | null, teamId: null as string | null };
vi.mock("./detailNavigation", () => ({
  useModelDetailRouting: () => ({ ...detailState, close: vi.fn(), openModel: vi.fn(), openTeam: vi.fn() }),
}));

vi.mock("@/components/molecules/DecisionModelsBanner", () => ({
  default: () => <section aria-label="Decision models" />,
}));
vi.mock("@/components/model_info_view", () => ({
  default: ({ modelId }: { modelId: string }) => <div data-testid="model-info">model:{modelId}</div>,
}));
const teamInfoProps = vi.hoisted(() => vi.fn());
vi.mock("@/components/team/TeamInfo", () => ({
  default: (props: { teamId: string; is_team_admin: boolean; is_proxy_admin: boolean }) => {
    teamInfoProps(props);
    return (
      <div data-testid="team-info" data-team-admin={String(props.is_team_admin)}>
        team:{props.teamId}
      </div>
    );
  },
}));

const mockUseAuthorized = vi.fn();
vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({ default: () => mockUseAuthorized() }));
vi.mock("@/app/(dashboard)/hooks/teams/useTeams", () => ({ useTeams: () => ({ data: [] }) }));
vi.mock("@/app/(dashboard)/hooks/uiSettings/useUISettings", () => ({
  useUISettings: () => ({ data: { values: {} } }),
}));
vi.mock("./useModelDashboardData", () => ({
  useModelDashboardData: () => ({ availableModelAccessGroups: [], allModelsOnProxy: [], availableModelGroups: [] }),
}));

const ADMIN = { accessToken: "at", token: "t", userRole: "Admin", userId: "u1", premiumUser: false, isViewOnly: false };
const NON_ADMIN = {
  accessToken: "at",
  token: "t",
  userRole: "Internal User",
  userId: "u1",
  premiumUser: false,
  isViewOnly: false,
};
// A proxy_admin_viewer session: effectiveSessionRole masquerades the role as "Admin".
const VIEW_ONLY_ADMIN = { ...ADMIN, isViewOnly: true };

const renderPage = (options?: { searchParams?: string; onUrlUpdate?: OnUrlUpdateFunction }) =>
  renderWithProviders(<ModelsAndEndpointsPage />, options);

const lastUrlParams = (onUrlUpdate: Mock<OnUrlUpdateFunction>): URLSearchParams | undefined =>
  onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;

const ADD_MODEL_PREFILL_LINK = "?tab=add&provider=typesafe&litellm_model=typesafe%2Fjev-latest";

describe("ModelsAndEndpointsPage", () => {
  beforeEach(() => {
    detailState.modelId = null;
    detailState.teamId = null;
    mockUseAuthorized.mockReturnValue(ADMIN);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("renders the admin tab bar and the All Models panel by default", () => {
    renderPage();
    expect(screen.getByRole("tab", { name: "已部署模型" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "LLM 凭据" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "健康状态" })).toBeInTheDocument();
    expect(screen.getByTestId("panel-all-models")).toBeInTheDocument();
  });

  it("switches tabs in-memory, mounting only the active panel", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("tab", { name: "健康状态" }));
    expect(screen.getByTestId("panel-health")).toBeInTheDocument();
    expect(screen.queryByTestId("panel-all-models")).not.toBeInTheDocument();
  });

  it("does not show a view-only session the decision models banner, whose Playground it cannot open", () => {
    mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
    renderPage();
    expect(screen.queryByRole("region", { name: "Decision models" })).not.toBeInTheDocument();
  });

  it("renders the model detail overlay from the ?model drill-in and hides the tabs", () => {
    detailState.modelId = "abc-123";
    renderPage();
    expect(screen.getByTestId("model-info")).toHaveTextContent("model:abc-123");
    expect(screen.queryByRole("tab", { name: "已部署模型" })).not.toBeInTheDocument();
  });

  it("renders the team detail overlay from the ?team drill-in with admin edit rights", () => {
    detailState.teamId = "team-9";
    renderPage();
    expect(screen.getByTestId("team-info")).toHaveTextContent("team:team-9");
    expect(screen.getByTestId("team-info")).toHaveAttribute("data-team-admin", "true");
  });

  it("passes is_proxy_admin for an admin session on the ?team drill-in", () => {
    detailState.teamId = "team-a1b2";
    renderPage();
    expect(teamInfoProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ is_proxy_admin: true, is_team_admin: true }),
    );
  });

  it("opens the ?team drill-in without edit rights for a view-only admin", () => {
    mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
    detailState.teamId = "team-9";
    renderPage();
    expect(screen.getByTestId("team-info")).toHaveTextContent("team:team-9");
    expect(screen.getByTestId("team-info")).toHaveAttribute("data-team-admin", "false");
    expect(teamInfoProps).toHaveBeenLastCalledWith(expect.objectContaining({ is_proxy_admin: false }));
  });

  it("hides admin-only tabs for a non-admin user but keeps LLM Credentials for their connections", () => {
    mockUseAuthorized.mockReturnValue(NON_ADMIN);
    renderPage();
    expect(screen.getByRole("tab", { name: "LLM 凭据" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "健康状态" })).not.toBeInTheDocument();
  });

  it("hides LLM Credentials from an internal viewer", () => {
    mockUseAuthorized.mockReturnValue({ ...NON_ADMIN, userRole: "Internal Viewer", isViewOnly: true });
    renderPage();
    expect(screen.queryByRole("tab", { name: "LLM 凭据" })).not.toBeInTheDocument();
  });

  it("keeps the full admin tab order for a real admin", () => {
    renderPage();
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "已部署模型",
      "添加模型",
      "自动路由器 Beta",
      "LLM 凭据",
      "直通端点",
      "健康状态",
      "模型重试设置",
      "模型组别名",
      "模型访问组预算 Beta",
      "价格数据重载",
    ]);
  });

  it("hides the admin write-form tabs from a view-only admin, keeping the read views", () => {
    mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
    renderPage();
    expect(screen.getByRole("tab", { name: "已部署模型" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "健康状态" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "LLM 凭据" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "直通端点" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "模型重试设置" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "模型组别名" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /模型访问组预算/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "价格数据重载" })).not.toBeInTheDocument();
  });

  // POST /model/new 403s a proxy_admin_viewer, so the form's tab must not render for one.
  it("hides the Add Model tab for a view-only admin session", () => {
    mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
    renderPage();
    expect(screen.queryByRole("tab", { name: "添加模型" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "已部署模型" })).toBeInTheDocument();
  });

  // Read parity: the Auto-Routers list stays reachable for a view-only admin; only the
  // create affordance inside it is withheld, which AutoRoutersTabPanel decides.
  it("keeps the Auto-Routers tab for a view-only admin session", () => {
    mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
    renderPage();
    expect(screen.getByRole("tab", { name: /自动路由器/ })).toBeInTheDocument();
  });

  // Auto-routers are excluded from the All Models table, so this tab is their home: the only
  // place in the product to list, create, edit or delete one.
  describe("Auto-Routers tab", () => {
    it("sits third, after All Models and Add Model", () => {
      renderPage();

      const tabs = screen.getAllByRole("tab").map((tab) => tab.textContent);
      expect(tabs[0]).toContain("已部署模型");
      expect(tabs[1]).toBe("添加模型");
      expect(tabs[2]).toContain("自动路由器");
      // Badged Beta while the tab settles; BetaBadge renders the label text.
      expect(tabs[2]).toContain("Beta");
    });

    it("renders its panel when selected", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(screen.getByRole("tab", { name: /自动路由器/ }));
      expect(screen.getByTestId("panel-auto-routers")).toBeInTheDocument();
    });

    it("is hidden from non-admins, who cannot write models", () => {
      mockUseAuthorized.mockReturnValue(NON_ADMIN);
      renderPage();

      expect(screen.queryByRole("tab", { name: /自动路由器/ })).not.toBeInTheDocument();
    });
  });

  describe("tab from the URL", () => {
    it("opens the Add Model tab from ?tab=add for an admin", () => {
      renderPage({ searchParams: "?tab=add" });

      expect(screen.getByRole("tab", { name: "添加模型" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("panel-add")).toBeInTheDocument();
      expect(screen.queryByTestId("panel-all-models")).not.toBeInTheDocument();
    });

    it("falls back to Deployed Models on ?tab=add for a view-only admin, who has no Add Model tab", () => {
      mockUseAuthorized.mockReturnValue(VIEW_ONLY_ADMIN);
      renderPage({ searchParams: "?tab=add" });

      expect(screen.getByRole("tab", { name: "已部署模型" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("panel-all-models")).toBeInTheDocument();
      expect(screen.queryByTestId("panel-add")).not.toBeInTheDocument();
    });

    it("falls back to Deployed Models on an unknown ?tab", () => {
      renderPage({ searchParams: "?tab=nope" });

      expect(screen.getByRole("tab", { name: "已部署模型" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByTestId("panel-all-models")).toBeInTheDocument();
    });

    it("records a UI event for each tab the user clicks", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(screen.getByRole("tab", { name: "健康状态" }));

      expect(recordUiEvent).toHaveBeenCalledWith({
        page: "models-and-endpoints",
        action: "click",
        target: "tab=health",
      });
    });

    it("writes the clicked tab to the URL and clears it for Deployed Models", async () => {
      const user = userEvent.setup();
      const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
      renderPage({ onUrlUpdate });

      await user.click(screen.getByRole("tab", { name: "健康状态" }));
      await waitFor(() => expect(lastUrlParams(onUrlUpdate)?.get("tab")).toBe("health"));
      expect(screen.getByTestId("panel-health")).toBeInTheDocument();

      await user.click(screen.getByRole("tab", { name: "已部署模型" }));
      await waitFor(() => expect(lastUrlParams(onUrlUpdate)?.get("tab")).toBeNull());
      expect(screen.getByTestId("panel-all-models")).toBeInTheDocument();
    });

    it("drops the Add Model prefill params when the user leaves the tab", async () => {
      const user = userEvent.setup();
      const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
      renderPage({ searchParams: ADD_MODEL_PREFILL_LINK, onUrlUpdate });

      await user.click(screen.getByRole("tab", { name: "已部署模型" }));

      await waitFor(() => expect(lastUrlParams(onUrlUpdate)?.get("tab")).toBeNull());
      expect(lastUrlParams(onUrlUpdate)?.get("provider")).toBeNull();
      expect(lastUrlParams(onUrlUpdate)?.get("litellm_model")).toBeNull();
    });
  });
});
