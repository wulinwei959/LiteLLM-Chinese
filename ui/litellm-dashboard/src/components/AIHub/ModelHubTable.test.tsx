import * as networking from "@/components/networking";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import type { Agent } from "@/components/agents/types";
import { makeAgent } from "@/../tests/mocks/agents";
import type { MCPServerData } from "./MCPHubTableColumns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, testQueryClient, waitFor, within } from "../../../tests/test-utils";
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
  getGlobalLitellmHeaderName: vi.fn(() => "X-Litellm-Key"),
  getPublicModelHubInfo: vi.fn().mockResolvedValue({
    docs_title: "Docs",
    custom_docs_description: null,
    litellm_version: "1.0.0",
    useful_links: {},
  }),
  getProxyBaseUrl: vi.fn(() => "http://localhost:4000"),
  getGatewayBaseUrl: vi.fn(() => "http://gateway.local:5000"),
  getUiPageUrl: (url: string) => url,
  getAgentsList: vi.fn(),
  fetchMCPServers: vi.fn(),
  makeMCPPublicCall: vi.fn(),
  getUiSettings: vi.fn(),
  getClaudeCodePluginsList: vi.fn(() => Promise.resolve({ plugins: [] })),
  modelCostMap: vi.fn(() => Promise.resolve({})),
  getProviderCreateMetadata: vi.fn(() => Promise.resolve([])),
  getGuardrailUISettings: vi.fn(() => Promise.resolve({})),
}));

const GARDEN_COST_MAP = {
  "typesafe/jev-latest": { litellm_provider: "typesafe", mode: "evaluation" },
  "cloudflare/clef": { litellm_provider: "cloudflare", mode: "evaluation" },
  "newvendor/decider": { litellm_provider: "newvendor", mode: "evaluation" },
  "laya/english": { litellm_provider: "laya", mode: "evaluation", supported_endpoints: ["/v1/systemone"] },
  "claude-opus-4-8": { litellm_provider: "anthropic", mode: "chat" },
};

const ADDABLE_PROVIDER_FIELDS = [
  { provider: "TypeSafe", provider_display_name: "TypeSafe", litellm_provider: "typesafe", credential_fields: [] },
  { provider: "Laya", provider_display_name: "Laya", litellm_provider: "laya", credential_fields: [] },
  { provider: "OpenAI", provider_display_name: "OpenAI", litellm_provider: "openai", credential_fields: [] },
  {
    provider: "Azure_AI_Studio",
    provider_display_name: "Azure AI Foundry (Studio)",
    litellm_provider: "azure_ai",
    credential_fields: [],
  },
];

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
    testQueryClient.clear();
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

      renderWithProviders(
        <ModelHubTable
          accessToken={null}
          publicPage={true}
          premiumUser={false}
          userRole={null}
          canOpenPlayground={false}
          canAddModels={false}
        />,
      );

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
      <ModelHubTable
        accessToken="test-token"
        publicPage={false}
        premiumUser={false}
        userRole={null}
        canOpenPlayground
        canAddModels
      />,
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

    renderWithProviders(
      <ModelHubTable
        accessToken={null}
        publicPage={false}
        premiumUser={false}
        userRole={null}
        canOpenPlayground
        canAddModels
      />,
    );

    expect(await screen.findByText("暂无可用模型")).toBeInTheDocument();
    expect(networking.modelHubCall).not.toHaveBeenCalled();
  });

  it("should limit the chat catalog to browsing models even for an admin", async () => {
    vi.mocked(networking.modelHubCall).mockResolvedValue({
      data: [{ model_group: "chat-model", providers: ["openai"], mode: "chat" }],
    });
    mockUseUISettings.mockReturnValue({ data: { values: {} }, isLoading: false });

    renderWithProviders(
      <ModelHubTable
        accessToken="test-token"
        publicPage={false}
        premiumUser
        userRole="Admin"
        canOpenPlayground
        canAddModels
        variant="chat"
      />,
    );

    expect(await screen.findByRole("button", { name: /^chat-model/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search models" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "AI Hub" })).not.toBeInTheDocument();
    expect(screen.queryByText("Model Hub URL:")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Select Models to Make Public" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Add model" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "decisions" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("decision-model-garden")).not.toBeInTheDocument();
    expect(networking.modelHubCall).toHaveBeenCalledWith("test-token");
    expect(networking.getConfigFieldSetting).not.toHaveBeenCalled();
    expect(networking.getAgentsList).not.toHaveBeenCalled();
    expect(networking.fetchMCPServers).not.toHaveBeenCalled();
    expect(networking.getClaudeCodePluginsList).not.toHaveBeenCalled();
    expect(networking.getPublicModelHubInfo).not.toHaveBeenCalled();
    expect(networking.modelCostMap).not.toHaveBeenCalled();
  });

  it("should combine provider selection with other filters and clear only the requested filters", async () => {
    vi.mocked(networking.modelHubCall).mockResolvedValue({
      data: [
        { model_group: "openai-shared", providers: ["openai"], mode: "chat", supports_vision: true },
        { model_group: "anthropic-shared", providers: ["anthropic"], mode: "chat", supports_vision: true },
        { model_group: "openai-image", providers: ["openai"], mode: "image_generation" },
      ],
    });
    mockUseUISettings.mockReturnValue({ data: { values: {} }, isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(
      <ModelHubTable
        accessToken="test-token"
        publicPage={false}
        premiumUser={false}
        userRole="Admin"
        canOpenPlayground={false}
        canAddModels={false}
        variant="chat"
      />,
    );

    await screen.findByRole("button", { name: /^openai-shared/ });
    expect(screen.queryByDisplayValue("All Providers")).not.toBeInTheDocument();
    const provider = screen.getByRole("combobox", { name: "Provider" });
    const search = screen.getByRole("textbox", { name: "Search models" });
    const mode = screen.getByRole("combobox", { name: "Model type" });
    const feature = screen.getByRole("combobox", { name: "Model capability" });
    await user.type(search, "shared");
    await user.click(mode);
    await user.click(await screen.findByRole("option", { name: "chat", exact: true }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    await user.click(feature);
    await user.click(await screen.findByRole("option", { name: "Vision", exact: true }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    await user.click(provider);
    await user.click(await screen.findByRole("option", { name: "OpenAI", exact: true }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());

    expect(screen.getByRole("button", { name: /^openai-shared/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^anthropic-shared/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^openai-image/ })).not.toBeInTheDocument();
    expect(provider).toHaveTextContent("OpenAI");

    await user.click(provider);
    await user.click(await screen.findByRole("option", { name: "All providers", exact: true }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: /^anthropic-shared/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^openai-image/ })).not.toBeInTheDocument();
    expect(search).toHaveValue("shared");
    expect(mode).toHaveTextContent("chat");
    expect(feature).toHaveTextContent("Vision");

    await user.click(provider);
    await user.click(await screen.findByRole("option", { name: "Anthropic", exact: true }));
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(provider).toHaveTextContent("All providers");
    expect(search).toHaveValue("");
    expect(mode).toHaveTextContent("All types");
    expect(feature).toHaveTextContent("All capabilities");
    expect(screen.getByRole("button", { name: /^openai-image/ })).toBeInTheDocument();
    expect(screen.getByLabelText("3 models")).toBeInTheDocument();
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

    renderWithProviders(
      <ModelHubTable
        accessToken={null}
        publicPage={true}
        premiumUser={false}
        userRole={null}
        canOpenPlayground={false}
        canAddModels={false}
      />,
    );

    await waitFor(() => {
      expect(getUiConfigMock).toHaveBeenCalled();
      expect(modelHubPublicModelsCallMock).toHaveBeenCalled();
    });

    const getUiConfigCallOrder = getUiConfigMock.mock.invocationCallOrder[0];
    const modelHubPublicModelsCallOrder = modelHubPublicModelsCallMock.mock.invocationCallOrder[0];

    expect(getUiConfigCallOrder).toBeLessThan(modelHubPublicModelsCallOrder);
  });

  describe("model details usage example", () => {
    const openDetails = async (
      model: { model_group: string; providers: string[]; mode: string },
      canOpenPlayground = true,
    ) => {
      vi.mocked(networking.modelHubCall).mockResolvedValue({ data: [model] });
      vi.mocked(networking.getConfigFieldSetting).mockResolvedValue({ field_value: false });
      vi.mocked(networking.getAgentsList).mockResolvedValue({ agents: [] });
      vi.mocked(networking.fetchMCPServers).mockResolvedValue([]);
      vi.mocked(networking.getUiSettings).mockResolvedValue({ values: {} });
      mockUseUISettings.mockReturnValue({ data: { values: {} }, isLoading: false });
      const user = userEvent.setup();
      renderWithProviders(
        <ModelHubTable
          accessToken="test-token"
          publicPage={false}
          premiumUser={false}
          userRole="Admin"
          canOpenPlayground={canOpenPlayground}
          canAddModels
        />,
      );
      await user.click(await screen.findByRole("button", { name: model.model_group }));
      return screen.findByRole("dialog");
    };

    it("shows a decision model how to call it on /v1/systemone, with the docs and the playground", async () => {
      const dialog = await openDetails({ model_group: "jev-latest", providers: ["typesafe"], mode: "evaluation" });

      expect(dialog).toHaveTextContent('"http://gateway.local:5000/v1/systemone"');
      expect(dialog).toHaveTextContent('headers={"X-Litellm-Key": "Bearer your_api_key"}');
      expect(dialog).not.toHaveTextContent("chat.completions");
      expect(screen.getByRole("link", { name: "如何调用决策模型" })).toHaveAttribute(
        "href",
        "https://docs.litellm.ai/docs/decisions",
      );
      expect(screen.getByRole("link", { name: "在演练场中试用" })).toHaveAttribute(
        "href",
        "/ui/playground?tab=system-one",
      );
    });

    it("does not link a view-only session to the Playground it cannot open", async () => {
      const dialog = await openDetails(
        { model_group: "jev-latest", providers: ["typesafe"], mode: "evaluation" },
        false,
      );

      expect(dialog).toHaveTextContent('"http://gateway.local:5000/v1/systemone"');
      expect(screen.getByRole("link", { name: "如何调用决策模型" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "在演练场中试用" })).not.toBeInTheDocument();
    });

    it("keeps the chat completions example for a chat model", async () => {
      const dialog = await openDetails({ model_group: "claude-opus-4-8", providers: ["anthropic"], mode: "chat" });

      expect(dialog).toHaveTextContent("client.chat.completions.create(");
      expect(dialog).toHaveTextContent('"http://gateway.local:5000"');
      expect(screen.queryByRole("link", { name: "如何调用决策模型" })).not.toBeInTheDocument();
    });
  });

  describe("decision model garden", () => {
    const renderHub = async (
      models: { model_group: string; providers: string[]; mode: string }[],
      {
        userRole = "Admin",
        canAddModels = true,
        loadProxySettings = async () => ({ decision_model_providers: ["typesafe", "cloudflare"] }),
        costMap = GARDEN_COST_MAP,
      }: {
        userRole?: string;
        canAddModels?: boolean;
        loadProxySettings?: () => Promise<unknown>;
        costMap?: Record<string, unknown>;
      } = {},
    ) => {
      vi.mocked(networking.modelHubCall).mockResolvedValue({ data: models });
      vi.mocked(networking.modelCostMap).mockResolvedValue(costMap);
      vi.mocked(networking.getProviderCreateMetadata).mockResolvedValue([
        ...ADDABLE_PROVIDER_FIELDS,
        {
          provider: "NewVendor",
          provider_display_name: "NewVendor",
          litellm_provider: "newvendor",
          credential_fields: [],
        },
      ]);
      vi.mocked(networking.getGuardrailUISettings).mockImplementation(loadProxySettings);
      vi.mocked(networking.getConfigFieldSetting).mockResolvedValue({ field_value: false });
      vi.mocked(networking.getAgentsList).mockResolvedValue({ agents: [] });
      vi.mocked(networking.fetchMCPServers).mockResolvedValue([]);
      vi.mocked(networking.getUiSettings).mockResolvedValue({ values: {} });
      mockUseUISettings.mockReturnValue({ data: { values: {} }, isLoading: false });
      const user = userEvent.setup();
      renderWithProviders(
        <ModelHubTable
          accessToken="test-token"
          publicPage={false}
          premiumUser={false}
          userRole={userRole}
          canOpenPlayground
          canAddModels={canAddModels}
        />,
      );
      await screen.findByText(/已显示 \d+，共 \d+ 个模型/);
      return { user, modeSelect: () => screen.getByDisplayValue("全部模式") };
    };

    const chatOnly = [{ model_group: "claude-opus-4-8", providers: ["anthropic"], mode: "chat" }];

    it("lists the decision models from the cost map when the proxy has none configured", async () => {
      await renderHub(chatOnly);

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("2 个决策模型分布于 2 个提供商，通过 /v1/decisions 响应");
      expect(within(garden).getByTestId("decision-model-card-typesafe/jev-latest")).toHaveTextContent("TypeSafe");
      expect(within(garden).getByTestId("decision-model-card-cloudflare/clef")).toHaveTextContent("Cloudflare");
      expect(within(garden).queryByText("claude-opus-4-8")).not.toBeInTheDocument();
    });

    it("sends a self-hosted model that does not answer on /v1/decisions to its own docs, with no Add Model link", async () => {
      await renderHub(chatOnly);

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("另有 1 个为自托管，走各自的路由响应。");
      const layaCard = within(garden).getByTestId("decision-model-card-laya/english");
      expect(within(layaCard).queryByRole("link", { name: "/v1/decisions 文档" })).not.toBeInTheDocument();
      expect(within(layaCard).getByRole("link", { name: "自托管，走自己的路由" })).toHaveAttribute(
        "href",
        "https://docs.litellm.ai/docs/decisions#self-hosted-laya-and-nimble",
      );
      expect(await within(garden).findAllByRole("link", { name: "添加模型" })).toHaveLength(1);
      expect(within(layaCard).queryByRole("link", { name: "添加模型" })).not.toBeInTheDocument();
    });

    it("links each card to the decisions docs and to Add Model prefilled with that provider and model", async () => {
      await renderHub(chatOnly);

      const card = within(await screen.findByTestId("decision-model-garden")).getByTestId(
        "decision-model-card-typesafe/jev-latest",
      );
      expect(within(card).getByRole("link", { name: "/v1/decisions 文档" })).toHaveAttribute(
        "href",
        "https://docs.litellm.ai/docs/decisions",
      );
      expect(await within(card).findByRole("link", { name: "添加模型" })).toHaveAttribute(
        "href",
        expect.stringMatching(/\/models-and-endpoints\?tab=add&provider=typesafe&litellm_model=typesafe%2Fjev-latest$/),
      );
    });

    it("labels a model whose provider this proxy cannot serve on /v1/decisions, with no Add Model and no count", async () => {
      await renderHub(chatOnly);

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("2 个决策模型分布于 2 个提供商，通过 /v1/decisions 响应");
      expect(garden).toHaveTextContent("另有 1 个需要更新的 LiteLLM 版本。");
      const newCard = within(garden).getByTestId("decision-model-card-newvendor/decider");
      expect(within(newCard).getByRole("link", { name: "需要升级 LiteLLM" })).toHaveAttribute(
        "href",
        "https://docs.litellm.ai/docs/decisions#supported-providers",
      );
      expect(await within(garden).findAllByRole("link", { name: "添加模型" })).toHaveLength(1);
      expect(within(newCard).queryByRole("link", { name: "添加模型" })).not.toBeInTheDocument();
    });

    it("lists OpenAI's chat model that answers on /v1/decisions, with Add Model prefilled", async () => {
      await renderHub(chatOnly, {
        loadProxySettings: async () => ({ decision_model_providers: ["openai"] }),
        costMap: {
          "gpt-6-luna": {
            litellm_provider: "openai",
            mode: "chat",
            supported_endpoints: ["/v1/chat/completions", "/v1/decisions"],
          },
          "gpt-5.5": { litellm_provider: "openai", mode: "chat", supported_endpoints: ["/v1/chat/completions"] },
        },
      });

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("1 个决策模型分布于 1 个提供商，通过 /v1/decisions 响应。");
      const card = within(garden).getByTestId("decision-model-card-gpt-6-luna");
      expect(await within(card).findByRole("link", { name: "添加模型" })).toHaveAttribute(
        "href",
        expect.stringMatching(/\?tab=add&provider=openai&litellm_model=gpt-6-luna$/),
      );
      expect(within(garden).queryByTestId("decision-model-card-gpt-5.5")).not.toBeInTheDocument();
    });

    it("sends a Foundry decision model to the docs for its deployment name instead of prefilling one Azure refuses", async () => {
      await renderHub(chatOnly, {
        loadProxySettings: async () => ({ decision_model_providers: ["typesafe", "azure_ai"] }),
        costMap: {
          "typesafe/jev-latest": { litellm_provider: "typesafe", mode: "evaluation" },
          "azure_ai/Microsoft-Decision-1": { litellm_provider: "azure_ai", mode: "evaluation" },
        },
      });

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("2 个决策模型分布于 2 个提供商，通过 /v1/decisions 响应");
      const foundryCard = within(garden).getByTestId("decision-model-card-azure_ai/Microsoft-Decision-1");
      expect(within(foundryCard).getByRole("link", { name: "以自己的名称部署" })).toHaveAttribute(
        "href",
        "https://docs.litellm.ai/docs/decisions#supported-providers",
      );
      expect(await within(garden).findAllByRole("link", { name: "添加模型" })).toHaveLength(1);
      expect(within(foundryCard).queryByRole("link", { name: "添加模型" })).not.toBeInTheDocument();
    });

    it("falls back to the cost map alone when this proxy's decision provider list cannot be read", async () => {
      await renderHub(chatOnly, {
        loadProxySettings: async () => {
          throw new Error("Failed to get guardrail UI settings");
        },
      });

      const garden = await screen.findByTestId("decision-model-garden");
      expect(garden).toHaveTextContent("3 个决策模型分布于 3 个提供商，通过 /v1/decisions 响应");
      expect(garden).not.toHaveTextContent("a newer LiteLLM version");
    });

    it("offers a decisions mode option that keeps the garden, hides the chat rows, and points at the garden", async () => {
      const { user, modeSelect } = await renderHub(chatOnly);
      await screen.findByTestId("decision-model-garden");

      expect(within(modeSelect()).queryByRole("option", { name: "evaluation" })).not.toBeInTheDocument();
      await user.selectOptions(modeSelect(), "decisions");

      expect(screen.getByTestId("decision-model-garden")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "claude-opus-4-8" })).not.toBeInTheDocument();
      expect(screen.getByText("已显示 0，共 1 个模型")).toBeInTheDocument();
      expect(screen.getByText("该代理上没有模型使用决策模式")).toBeInTheDocument();
      expect(screen.queryByText("调整搜索关键词或筛选条件即可看到更多模型。")).not.toBeInTheDocument();
    });

    it("hides the garden while a non-decision mode is selected", async () => {
      const { user, modeSelect } = await renderHub(chatOnly);
      await screen.findByTestId("decision-model-garden");

      await user.selectOptions(modeSelect(), "chat");
      expect(screen.queryByTestId("decision-model-garden")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "清除筛选" }));
      expect(await screen.findByTestId("decision-model-garden")).toBeInTheDocument();
    });

    it("labels a configured evaluation model as decisions in the table and under the decisions filter", async () => {
      const { user, modeSelect } = await renderHub([
        ...chatOnly,
        { model_group: "jev-latest", providers: ["typesafe"], mode: "evaluation" },
      ]);

      const row = screen.getByRole("button", { name: "jev-latest" }).closest("tr");
      expect(row).toHaveTextContent("decisions");
      expect(row).not.toHaveTextContent("evaluation");

      await user.selectOptions(modeSelect(), "decisions");
      expect(screen.getByText("已显示 1，共 2 个模型")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "jev-latest" })).toBeInTheDocument();
    });

    it("drops the Add Model link for an admin session that cannot add models", async () => {
      await renderHub(chatOnly, { canAddModels: false });

      const garden = await screen.findByTestId("decision-model-garden");
      expect(within(garden).queryByRole("link", { name: "添加模型" })).not.toBeInTheDocument();
      expect(within(garden).getAllByRole("link", { name: "/v1/decisions 文档" })).toHaveLength(2);
    });

    it("drops the Add Model link on a card whose provider the Add Model form cannot create", async () => {
      await renderHub(chatOnly);

      const garden = await screen.findByTestId("decision-model-garden");
      const typesafeCard = within(garden).getByTestId("decision-model-card-typesafe/jev-latest");
      const cloudflareCard = within(garden).getByTestId("decision-model-card-cloudflare/clef");
      expect(await within(typesafeCard).findByRole("link", { name: "添加模型" })).toBeInTheDocument();
      expect(within(cloudflareCard).queryByRole("link", { name: "添加模型" })).not.toBeInTheDocument();
      expect(within(cloudflareCard).getByRole("link", { name: "/v1/decisions 文档" })).toBeInTheDocument();
    });

    it("sorts the Mode column by the label it shows, placing decisions between chat and embedding", async () => {
      const { user } = await renderHub([
        { model_group: "text-embedding-4", providers: ["openai"], mode: "embedding" },
        { model_group: "jev-latest", providers: ["typesafe"], mode: "evaluation" },
        ...chatOnly,
      ]);

      await user.click(screen.getByTestId("sort-header-mode"));

      const order = screen
        .getAllByRole("button", { name: /^(claude-opus-4-8|jev-latest|text-embedding-4)$/ })
        .map((button) => button.textContent);
      expect(order).toEqual(["claude-opus-4-8", "jev-latest", "text-embedding-4"]);
    });
  });

  describe("hub tabs", () => {
    const renderHub = async (agents: Agent[] = [], mcpServers: Promise<MCPServerData[]> = Promise.resolve([])) => {
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
        <ModelHubTable
          accessToken="test-token"
          publicPage={false}
          premiumUser={false}
          userRole="Admin"
          canOpenPlayground
          canAddModels
        />,
      );
      return { user, search: await screen.findByPlaceholderText("搜索模型名称...") };
    };

    it("uses the backend URL for MCP server connection examples", async () => {
      const server: MCPServerData = {
        server_id: "server-1",
        server_name: "exa_test",
        url: "https://upstream.example.com/mcp",
        transport: "http",
        auth_type: "none",
        created_at: "2024-01-01T00:00:00Z",
        created_by: "test-user",
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: "test-user",
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
      const { user } = await renderHub([], Promise.resolve([server]));

      await user.click(screen.getByRole("tab", { name: "MCP 中心" }));
      await user.click(await screen.findByText("exa_test"));

      expect(await screen.findByText(/http:\/\/localhost:4000\/exa_test\/mcp/)).toBeInTheDocument();
      expect(screen.queryByText(/http:\/\/gateway\.local:5000\/exa_test\/mcp/)).not.toBeInTheDocument();
    });

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

      expect(await screen.findByPlaceholderText("搜索模型名称...")).toHaveValue("opus");
    });

    it("filters the Agent Hub table by name or description and shows the no-match state", async () => {
      const { user } = await renderHub([
        makeAgent({
          agent_id: "a1",
          agent_card_params: { name: "Billing Router", description: "routes billing questions" },
          litellm_params: { is_public: false },
        }),
        makeAgent({
          agent_id: "a2",
          agent_card_params: { name: "Support Bot", description: "handles support tickets" },
          litellm_params: { is_public: false },
        }),
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
