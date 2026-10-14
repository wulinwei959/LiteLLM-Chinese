import * as networking from "@/components/networking";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import type { MCPServerData } from "./MCPHubTableColumns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, waitFor, within } from "../../../tests/test-utils";
import ModelHubTable from "./ModelHubTable";

const mockUseUISettings = vi.hoisted(() => vi.fn());
const mockGetCookie = vi.hoisted(() => vi.fn());
const mockCheckTokenValidity = vi.hoisted(() => vi.fn());
const mockRouterReplace = vi.hoisted(() => vi.fn());
const mockLocationReplace = vi.hoisted(() => vi.fn());

vi.mock("@/components/networking", () => ({
  getUiConfig: vi.fn(),
  modelHubPublicModelsCall: vi.fn(),
  modelHubCall: vi.fn(),
  getConfigFieldSetting: vi.fn(),
  getProxyBaseUrl: vi.fn(() => "http://localhost:4000"),
  getAgentsList: vi.fn(),
  fetchMCPServers: vi.fn(),
  makeMCPPublicCall: vi.fn(),
  getUiSettings: vi.fn(),
  getClaudeCodePluginsList: vi.fn(() => Promise.resolve({ plugins: [] })),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock("@/components/public_model_hub", () => ({
  default: () => <div>Public Model Hub</div>,
}));

vi.mock("@/app/(dashboard)/hooks/uiSettings/useUISettings", () => ({
  useUISettings: mockUseUISettings,
}));

vi.mock("@/utils/cookieUtils", () => ({
  getCookie: mockGetCookie,
}));

vi.mock("@/utils/jwtUtils", () => ({
  checkTokenValidity: mockCheckTokenValidity,
}));

describe("ModelHubTable", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost:4000/ui/model_hub_table",
        origin: "http://localhost:4000",
        hostname: "localhost",
        pathname: "/ui/model_hub_table",
        search: "",
        protocol: "http:",
        replace: mockLocationReplace,
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
    vi.clearAllMocks();
  });

  // Reusable helper function to setup mocks for auth redirect tests
  const setupAuthRedirectTest = (requireAuth: boolean, tokenValue: string | null, isTokenValid: boolean) => {
    mockUseUISettings.mockReturnValue({
      data: {
        values: {
          require_auth_for_public_ai_hub: requireAuth,
        },
      },
      isLoading: false,
    });
    mockGetCookie.mockReturnValue(tokenValue);
    mockCheckTokenValidity.mockReturnValue(isTokenValid);
    mockRouterReplace.mockClear();
    mockLocationReplace.mockClear();

    // Setup other required mocks
    vi.mocked(networking.getUiConfig).mockResolvedValue({
      server_root_path: "/",
      proxy_base_url: "http://localhost:4000",
      auto_redirect_to_sso: false,
      admin_ui_disabled: false,
      sso_configured: false,
    });
    vi.mocked(networking.modelHubPublicModelsCall).mockResolvedValue([]);
    vi.mocked(networking.getUiSettings).mockResolvedValue({
      values: {
        require_auth_for_public_ai_hub: requireAuth,
      },
    });
  };

  // Reusable test function for auth redirect scenarios
  const testAuthRedirect = (
    requireAuth: boolean,
    tokenValue: string | null,
    isTokenValid: boolean,
    shouldRedirect: boolean,
    description: string,
  ) => {
    it(description, async () => {
      setupAuthRedirectTest(requireAuth, tokenValue, isTokenValid);

      renderWithProviders(<ModelHubTable accessToken={null} publicPage={true} premiumUser={false} userRole={null} />);

      await waitFor(() => {
        if (shouldRedirect) {
          expect(mockLocationReplace).toHaveBeenCalledWith("http://localhost:4000/ui/login/");
          expect(mockRouterReplace).not.toHaveBeenCalled();
        } else {
          expect(mockLocationReplace).not.toHaveBeenCalled();
        }
      });
    });
  };

  it("should render", async () => {
    vi.mocked(networking.modelHubCall).mockResolvedValue({
      data: [],
    });
    vi.mocked(networking.getConfigFieldSetting).mockResolvedValue({
      field_value: false,
    });
    vi.mocked(networking.getAgentsList).mockResolvedValue({
      agents: [],
    });
    vi.mocked(networking.fetchMCPServers).mockResolvedValue([]);
    vi.mocked(networking.getUiSettings).mockResolvedValue({
      values: {},
    });
    mockUseUISettings.mockReturnValue({
      data: { values: {} },
      isLoading: false,
    });

    renderWithProviders(
      <ModelHubTable accessToken="test-token" publicPage={false} premiumUser={false} userRole={null} />,
    );

    await waitFor(() => {
      expect(screen.getByText("AI 中心")).toBeInTheDocument();
    });
  });

  it("should resolve loading to the empty state when there is no access token on the admin page", async () => {
    vi.mocked(networking.getUiSettings).mockResolvedValue({
      values: {},
    });
    mockUseUISettings.mockReturnValue({
      data: { values: {} },
      isLoading: false,
    });

    renderWithProviders(<ModelHubTable accessToken={null} publicPage={false} premiumUser={false} userRole={null} />);

    expect(await screen.findByText("暂无模型")).toBeInTheDocument();
    expect(networking.modelHubCall).not.toHaveBeenCalled();
  });

  it("should call getUiConfig before modelHubPublicModelsCall when publicPage is true", async () => {
    const getUiConfigMock = vi.mocked(networking.getUiConfig);
    const modelHubPublicModelsCallMock = vi.mocked(networking.modelHubPublicModelsCall);

    getUiConfigMock.mockResolvedValue({
      server_root_path: "/",
      proxy_base_url: "http://localhost:4000",
      auto_redirect_to_sso: false,
      admin_ui_disabled: false,
      sso_configured: false,
    });
    modelHubPublicModelsCallMock.mockResolvedValue([]);
    vi.mocked(networking.getUiSettings).mockResolvedValue({
      values: {},
    });
    mockUseUISettings.mockReturnValue({
      data: { values: {} },
      isLoading: false,
    });

    renderWithProviders(<ModelHubTable accessToken={null} publicPage={true} premiumUser={false} userRole={null} />);

    await waitFor(() => {
      expect(getUiConfigMock).toHaveBeenCalled();
      expect(modelHubPublicModelsCallMock).toHaveBeenCalled();
    });

    const getUiConfigCallOrder = getUiConfigMock.mock.invocationCallOrder[0];
    const modelHubPublicModelsCallOrder = modelHubPublicModelsCallMock.mock.invocationCallOrder[0];

    expect(getUiConfigCallOrder).toBeLessThan(modelHubPublicModelsCallOrder);
  });

  describe("hub tabs", () => {
    const renderHub = async (agents: object[] = [], mcpServers: Promise<MCPServerData[]> = Promise.resolve([])) => {
      vi.mocked(networking.modelHubCall).mockResolvedValue({
        data: [{ model_group: "claude-opus-4-8", providers: ["anthropic"], mode: "chat" }],
      });
      vi.mocked(networking.getConfigFieldSetting).mockResolvedValue({ field_value: false });
      vi.mocked(networking.getAgentsList).mockResolvedValue({ agents });
      vi.mocked(networking.fetchMCPServers).mockReturnValue(mcpServers);
      vi.mocked(networking.getUiSettings).mockResolvedValue({ values: {} });
      mockUseUISettings.mockReturnValue({ data: { values: {} }, isLoading: false });

      const user = userEvent.setup();
      renderWithProviders(
        <ModelHubTable accessToken="test-token" publicPage={false} premiumUser={false} userRole="Admin" />,
      );
      return { user, search: await screen.findByPlaceholderText("Search model names...") };
    };

    it("requires a fresh MCP publication list before and after saving", async () => {
      const servers = Promise.withResolvers<MCPServerData[]>();
      const { user } = await renderHub([], servers.promise);
      await user.click(screen.getByRole("tab", { name: "MCP 中心" }));

      const manageVisibility = screen.getByRole("button", { name: "管理 MCP 中心的可见性" });
      expect(manageVisibility).toBeDisabled();
      await act(async () => servers.resolve([]));
      expect(manageVisibility).toBeEnabled();

      const refresh = Promise.withResolvers<MCPServerData[]>();
      vi.mocked(networking.makeMCPPublicCall).mockResolvedValueOnce({});
      vi.mocked(networking.fetchMCPServers).mockReturnValueOnce(refresh.promise);
      await user.click(manageVisibility);
      await user.click(screen.getByRole("button", { name: "下一步" }));
      await user.click(screen.getByRole("button", { name: "保存公开列表" }));

      expect(networking.makeMCPPublicCall).toHaveBeenCalledWith("test-token", []);
      expect(manageVisibility).toBeDisabled();
      await act(async () => refresh.reject(new Error("Unable to reload the publication list")));
      expect(manageVisibility).toBeDisabled();
    });

    it("keeps the model filter typed on the Model Hub tab after visiting another hub", async () => {
      const { user, search } = await renderHub();

      await user.type(search, "opus");
      await user.click(screen.getByRole("tab", { name: "智能体中心" }));
      await user.click(screen.getByRole("tab", { name: "模型中心" }));

      expect(await screen.findByPlaceholderText("Search model names...")).toHaveValue("opus");
    });

    it("filters the Agent Hub table by name or description and shows the no-match state", async () => {
      const { user } = await renderHub([
        {
          agent_id: "a1",
          agent_card_params: { name: "Billing Router", description: "routes billing questions" },
          litellm_params: { is_public: false },
        },
        {
          agent_id: "a2",
          agent_card_params: { name: "Support Bot", description: "handles support tickets" },
          litellm_params: { is_public: false },
        },
      ]);
      const agentCount = (expected: string) =>
        screen.getByText((_, el) => el?.tagName === "P" && el.textContent === expected);

      await user.click(screen.getByRole("tab", { name: "智能体中心" }));
      expect(await screen.findByText("Billing Router")).toBeInTheDocument();

      const search = screen.getByPlaceholderText("搜索智能体名称或描述...");
      await user.type(search, "support tickets");
      expect(screen.queryByText("Billing Router")).not.toBeInTheDocument();
      expect(screen.getByText("Support Bot")).toBeInTheDocument();
      expect(agentCount("已显示 1，共 2 个智能体")).toBeInTheDocument();

      await user.clear(search);
      await user.type(search, "zzzz");
      expect(screen.getByText("没有匹配的智能体")).toBeInTheDocument();
      expect(agentCount("已显示 0，共 2 个智能体")).toBeInTheDocument();
    });

    it("renders the hub strip as underlined tabs rather than a segmented pill", async () => {
      await renderHub();

      expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "line");
    });

    it("localizes the model details modal headings, labels and fallbacks", async () => {
      const { user } = await renderHub();

      await user.click(screen.getByRole("button", { name: "打开模型操作菜单" }));
      const detailsItem = await screen.findByTestId("model-hub-action-details");
      await user.click(detailsItem);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByText("模型概览")).toBeInTheDocument();
      expect(within(dialog).getByText("模型组：")).toBeInTheDocument();
      expect(within(dialog).getByText("Token 与成本信息")).toBeInTheDocument();
      expect(within(dialog).getByText("最大输入 Token 数：")).toBeInTheDocument();
      expect(within(dialog).queryByText("支持的 OpenAI 参数")).not.toBeInTheDocument();
      expect(within(dialog).getByText("能力")).toBeInTheDocument();
      expect(within(dialog).getByText("未列出特殊能力")).toBeInTheDocument();
      expect(within(dialog).getByText("使用示例")).toBeInTheDocument();
      expect(within(dialog).getAllByText("未指定")).toHaveLength(4);
    });
  });

  describe("authentication redirect behavior", () => {
    // Test cases where requireAuth is true - should redirect on invalid tokens
    testAuthRedirect(
      true,
      null,
      false,
      true,
      "should redirect to login when requireAuth is true and there is no token",
    );

    testAuthRedirect(
      true,
      "expired-token",
      false,
      true,
      "should redirect to login when requireAuth is true and token is expired",
    );

    testAuthRedirect(
      true,
      "malformed-token",
      false,
      true,
      "should redirect to login when requireAuth is true and token is malformed",
    );

    // Test cases where requireAuth is false - should NOT redirect regardless of token state
    testAuthRedirect(false, null, false, false, "should not redirect when requireAuth is false and there is no token");

    testAuthRedirect(
      false,
      "expired-token",
      false,
      false,
      "should not redirect when requireAuth is false and token is expired",
    );

    testAuthRedirect(
      false,
      "malformed-token",
      false,
      false,
      "should not redirect when requireAuth is false and token is malformed",
    );
  });
});
