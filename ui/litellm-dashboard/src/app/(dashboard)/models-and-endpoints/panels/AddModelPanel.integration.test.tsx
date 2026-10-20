import { renderWithProviders, screen, waitFor } from "../../../../../tests/test-utils";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddModelPanel from "./AddModelPanel";

const modelCreateCall = vi.fn();
const mockPtuEnabled = vi.fn();
const mockAuthorized = vi.fn();

vi.mock("@/components/networking", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/networking")>();
  return {
    ...actual,
    modelCreateCall: (t: unknown, accessToken: string, model: unknown) => modelCreateCall(t, accessToken, model),
    modelAvailableCall: vi.fn().mockResolvedValue({ data: [{ id: "group-a" }] }),
  };
});

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({ default: () => mockAuthorized() }));

vi.mock("@/app/(dashboard)/hooks/uiSettings/usePtuCostAttributionEnabled", () => ({
  usePtuCostAttributionEnabled: () => mockPtuEnabled(),
}));

vi.mock("@/app/(dashboard)/hooks/models/useModelCostMap", () => ({ useModelCostMap: () => ({ data: {} }) }));

vi.mock("@/app/(dashboard)/hooks/credentials/useCredentials", () => ({
  useCredentials: () => ({ data: { credentials: [] } }),
}));

vi.mock("@/app/(dashboard)/hooks/teams/useTeams", () => ({
  useTeams: () => ({ data: [] }),
  useInfiniteTeams: () => ({
    data: { pages: [{ teams: [], total: 0, page: 1, page_size: 20, total_pages: 1 }] },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  }),
}));

vi.mock("@/app/(dashboard)/hooks/guardrails/useGuardrails", () => ({
  useGuardrails: () => ({ data: { guardrails: [{ guardrail_name: "g-1" }] }, isLoading: false, error: null }),
}));

vi.mock("@/app/(dashboard)/hooks/tags/useTags", () => ({
  useTags: () => ({ data: {}, isLoading: false, error: null }),
}));

vi.mock("@/app/(dashboard)/hooks/providers/useProviderFields", () => ({
  useProviderFields: () => ({
    data: [
      {
        provider: "OpenAI",
        provider_display_name: "OpenAI",
        litellm_provider: "openai",
        default_model_placeholder: "gpt-4o",
        credential_fields: [
          { key: "api_key", label: "API Key", field_type: "password", required: false },
          { key: "api_base", label: "API Base", field_type: "text", required: false },
        ],
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/components/vector_store_management/VectorStoreSelector", () => ({
  default: () => <div data-testid="vector-store-selector" />,
}));

const lastCreatedModel = () => modelCreateCall.mock.calls.at(-1)?.[2];

const PROXY_ADMIN = {
  token: "t",
  accessToken: "test-access-token",
  userId: "user-1",
  userEmail: "a@b.c",
  userRole: "proxy_admin",
  premiumUser: true,
  disabledPersonalKeyCreation: false,
  showSSOBanner: false,
};

const alwaysMounted = {
  api_key: undefined,
  api_base: undefined,
  custom_llm_provider: "openai",
  model: "gpt-4o",
};

const advancedOpenExtras = {
  guardrails: undefined,
  tags: undefined,
  use_in_pass_through: undefined,
  vector_store_ids: undefined,
};

const baseModelInfo = { access_groups: undefined, mode: undefined };

const { api_base: _omitted, ...ALWAYS_MOUNTED_WITHOUT_API_BASE } = alwaysMounted;

const setup = async () => {
  const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
  renderWithProviders(<AddModelPanel />);
  await screen.findByText("提供商");

  const openAdvanced = async () => {
    await user.click(screen.getByText("高级设置"));
    await screen.findByText("标签");
  };

  const closeAdvanced = async () => {
    await user.click(screen.getByText("高级设置"));
    await waitFor(() => expect(screen.queryByText("标签")).not.toBeInTheDocument());
  };

  const fillRequired = async (modelName = "gpt-4o") => {
    await user.click(screen.getByRole("combobox", { name: /提供商/i }));
    await user.click(await screen.findByText("OpenAI"));
    await user.type(await screen.findByPlaceholderText("gpt-3.5-turbo"), modelName);
  };

  const submit = async () => {
    await user.click(screen.getByTestId("add-model-btn"));
    await waitFor(() => expect(modelCreateCall).toHaveBeenCalled());
  };

  const submitExpectingRejection = async (message: string) => {
    await user.click(screen.getByTestId("add-model-btn"));
    await screen.findByText(message);
  };

  return { user, openAdvanced, closeAdvanced, fillRequired, submit, submitExpectingRejection };
};

describe("AddModelPanel submit payload contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPtuEnabled.mockReturnValue(false);
    mockAuthorized.mockReturnValue(PROXY_ADMIN);
  });

  it("sends only the always-mounted fields while Advanced Settings stays closed", async () => {
    const { fillRequired, submit } = await setup();
    await fillRequired();
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted },
      model_info: { ...baseModelInfo },
    });
  });

  it("registers four more keys as undefined once Advanced Settings opens", async () => {
    const { openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted, ...advancedOpenExtras },
      model_info: { ...baseModelInfo },
    });
  });

  it("merges typed LiteLLM Params into litellm_params", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.type(screen.getByLabelText("LiteLLM 参数"), '{{"rpm": 7}');
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted, ...advancedOpenExtras, rpm: 7 },
      model_info: { ...baseModelInfo },
    });
  });

  it("drops a collapsed section's keys and the value typed into it", async () => {
    const { user, openAdvanced, closeAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.type(screen.getByLabelText("LiteLLM 参数"), '{{"rpm": 7}');
    await closeAdvanced();
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted },
      model_info: { ...baseModelInfo },
    });
  });

  it("restores the typed value when the section is expanded again", async () => {
    const { user, openAdvanced, closeAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.type(screen.getByLabelText("LiteLLM 参数"), '{{"rpm": 7}');
    await closeAdvanced();
    await openAdvanced();
    expect(screen.getByLabelText("LiteLLM 参数")).toHaveValue('{"rpm": 7}');

    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted, ...advancedOpenExtras, rpm: 7 },
      model_info: { ...baseModelInfo },
    });
  });

  it("converts per-million pricing to per-token and falls back to input cost for cache reads", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.click(screen.getByRole("switch", { name: "自定义定价" }));
    await user.type(await screen.findByLabelText("输入成本（每百万 Token）"), "3");
    await user.type(screen.getByLabelText("输出成本（每百万 Token）"), "9");
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: {
        ...alwaysMounted,
        ...advancedOpenExtras,
        input_cost_per_token: 0.000003,
        output_cost_per_token: 0.000009,
        cache_read_input_token_cost: 0.000003,
      },
      model_info: { ...baseModelInfo },
    });
  });

  it("sends the seeded injection point when cache control is switched on", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.click(screen.getByRole("switch", { name: "缓存控制" }));
    await screen.findByText("添加注入点");
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: {
        ...alwaysMounted,
        ...advancedOpenExtras,
        cache_control_injection_points: [{ location: "message" }],
      },
      model_info: { ...baseModelInfo },
    });
  });

  it("carries a role picked inside the injection point editor, with the index kept a string", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.click(screen.getByRole("switch", { name: "缓存控制" }));
    await screen.findByText("添加注入点");
    await user.click(screen.getByText("选择角色"));
    await user.click(await screen.findByText("系统"));
    await user.type(screen.getByPlaceholderText("可选"), "3");
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: {
        ...alwaysMounted,
        ...advancedOpenExtras,
        cache_control_injection_points: [{ location: "message", role: "system", index: "3" }],
      },
      model_info: { ...baseModelInfo },
    });
  });

  it("mounts team_id only once the Team-BYOK switch is on", async () => {
    const { user, fillRequired, submit } = await setup();
    await fillRequired();
    await user.click(screen.getByRole("switch", { name: "团队自带密钥模型" }));
    await screen.findByText("选择团队");
    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted },
      model_info: { ...baseModelInfo, team_id: undefined },
    });
  });
});

describe("AddModelPanel empty-string skip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPtuEnabled.mockReturnValue(false);
    mockAuthorized.mockReturnValue(PROXY_ADMIN);
  });

  it("sends a typed api_base, so the binding behind the next case is known to be live", async () => {
    const { user, fillRequired, submit } = await setup();
    await fillRequired();
    await user.type(screen.getByLabelText("API Base"), "https://example.test");
    await submit();

    expect(lastCreatedModel().litellm_params).toStrictEqual({
      ...alwaysMounted,
      api_base: "https://example.test",
    });
  });

  it("omits api_base entirely once it is cleared, rather than sending an empty string", async () => {
    const { user, fillRequired, submit } = await setup();
    await fillRequired();
    const apiBase = screen.getByLabelText("API Base");
    await user.type(apiBase, "https://example.test");
    await user.clear(apiBase);
    await submit();

    const params = lastCreatedModel().litellm_params;
    expect(params).not.toHaveProperty("api_base");
    expect(params).toStrictEqual(ALWAYS_MOUNTED_WITHOUT_API_BASE);
  });
});

describe("AddModelPanel validation gates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPtuEnabled.mockReturnValue(true);
    mockAuthorized.mockReturnValue(PROXY_ADMIN);
  });

  it("blocks the submit when a PTU count carries no effective-from date", async () => {
    const { user, openAdvanced, fillRequired, submitExpectingRejection } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.type(screen.getByLabelText("PTU 数量"), "15");
    await user.type(screen.getByLabelText("计算的 PTU 每小时成本 (USD)"), "2");
    await submitExpectingRejection("填写 PTU 数量后必须填写 PTU 生效起始时间");

    expect(modelCreateCall).not.toHaveBeenCalled();
  });

  it("hides the PTU fields entirely when the capability is off", async () => {
    mockPtuEnabled.mockReturnValue(false);
    const { openAdvanced, fillRequired } = await setup();
    await fillRequired();
    await openAdvanced();

    expect(screen.queryByLabelText("PTU 数量")).not.toBeInTheDocument();
  });

  it("requires a model before anything is sent", async () => {
    const { user, submitExpectingRejection } = await setup();
    await user.click(screen.getByRole("combobox", { name: /提供商/i }));
    await user.click(await screen.findByText("OpenAI"));
    await submitExpectingRejection("请至少选择一个模型。");

    expect(modelCreateCall).not.toHaveBeenCalled();
  });

  it("blocks the submit when LiteLLM Params is not valid JSON", async () => {
    mockPtuEnabled.mockReturnValue(false);
    const { user, openAdvanced, fillRequired, submitExpectingRejection } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.type(screen.getByLabelText("LiteLLM 参数"), "rpm: 7");
    await submitExpectingRejection("请输入有效的 JSON");

    expect(modelCreateCall).not.toHaveBeenCalled();
  });
});

describe("AddModelPanel behaviours the removed Advanced Settings form instance never drove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPtuEnabled.mockReturnValue(false);
    mockAuthorized.mockReturnValue(PROXY_ADMIN);
  });

  it("leaves LiteLLM Params untouched when pass through routes is switched on", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.click(screen.getByRole("switch", { name: "在直通路由中使用" }));
    expect(screen.getByLabelText("LiteLLM 参数")).toHaveValue("");

    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: { ...alwaysMounted, ...advancedOpenExtras, use_in_pass_through: true },
      model_info: { ...baseModelInfo },
    });
  });

  it("keeps a typed cost when custom pricing is switched off and back on", async () => {
    const { user, openAdvanced, fillRequired, submit } = await setup();
    await fillRequired();
    await openAdvanced();
    await user.click(screen.getByRole("switch", { name: "自定义定价" }));
    await user.type(await screen.findByLabelText("输入成本（每百万 Token）"), "3");
    await user.click(screen.getByRole("switch", { name: "自定义定价" }));
    await waitFor(() => expect(screen.queryByLabelText("输入成本（每百万 Token）")).not.toBeInTheDocument());
    await user.click(screen.getByRole("switch", { name: "自定义定价" }));
    expect(await screen.findByLabelText("输入成本（每百万 Token）")).toHaveValue("3");

    await submit();

    expect(lastCreatedModel()).toStrictEqual({
      model_name: "gpt-4o",
      litellm_params: {
        ...alwaysMounted,
        ...advancedOpenExtras,
        input_cost_per_token: 0.000003,
        cache_read_input_token_cost: 0.000003,
      },
      model_info: { ...baseModelInfo },
    });
  });
});
