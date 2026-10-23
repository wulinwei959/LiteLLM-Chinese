import { useAgents } from "@/app/(dashboard)/hooks/agents/useAgents";
import { useCustomers } from "@/app/(dashboard)/hooks/customers/useCustomers";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useIsOrgAdmin from "@/app/(dashboard)/hooks/useIsOrgAdmin";
import { useCurrentUser } from "@/app/(dashboard)/hooks/users/useCurrentUser";
import { useInfiniteUsers } from "@/app/(dashboard)/hooks/users/useUsers";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { UrlUpdateEvent } from "nuqs/adapters/testing";
import { renderWithProviders } from "@/../tests/test-utils";
import { toast } from "@/lib/toast";
import { processActivityData } from "@/components/activity_metrics";
import type { Organization } from "@/components/networking";
import type { ModelActivityData } from "@/components/UsagePage/types";
import * as networking from "@/components/networking";
import { STACKED_USAGE_PALETTE } from "@/components/shared/charts";
import { OTHER_COLOR } from "./overview/overviewData";
import UsagePage from "./UsagePageView";
import { authorizedSession } from "@tests/mocks/authorizedSession";

const SESSION_OVERRIDE_1 = {
  token: "mock-token",
  accessToken: "test-token",
  userId: "user-123",
  premiumUser: true,
  disabledPersonalKeyCreation: false,
};
const SESSION_OVERRIDE_2 = {
  token: "mock-token",
  accessToken: "test-token",
  userId: "user-123",
  userRole: "internal_user",
  premiumUser: true,
  disabledPersonalKeyCreation: false,
};
const SESSION_OVERRIDE_4 = {
  token: "mock-token",
  accessToken: "test-token",
  userId: "user-123",
  userRole: "Internal User",
  disabledPersonalKeyCreation: false,
};

const mockEntityUsageMounted = vi.hoisted(() => vi.fn());

// The Overview tab. The Key Activity tab stays mounted and carries its own spend-derived totals,
// so assertions about the overview's request tiles are scoped here rather than to the whole page.
const overview = () => within(screen.getByRole("tabpanel", { name: "概览" }));

// The Total Requests stat cell: its label, the count, and the "N ok / N failed" line beneath it.
const totalRequestsCell = (): HTMLElement => {
  const cell = overview().getByText("总请求数").parentElement?.parentElement;
  expect(cell).toBeTruthy();
  return cell as HTMLElement;
};

const modelActivity = (label: string): ModelActivityData => ({
  label,
  total_requests: 1,
  total_successful_requests: 1,
  total_failed_requests: 0,
  total_cache_read_input_tokens: 0,
  total_cache_creation_input_tokens: 0,
  total_tokens: 10,
  prompt_tokens: 5,
  completion_tokens: 5,
  total_spend: 0.01,
  top_models: [],
  daily_data: [],
});

// Polyfill ResizeObserver for test environment
beforeAll(() => {
  if (typeof window !== "undefined" && !window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
  }
});

// Mock the networking module
vi.mock("@/components/networking", () => ({
  dailyActivityAggregatedCall: vi.fn(),
  dailyActivityKeyPageCall: vi.fn(),
  userDailyActivityUserPageCall: vi.fn(),
  dailyActivityKeySearchCall: vi.fn(),
  dailyActivityModelTopKeysCall: vi.fn(),
  dailyActivityExportCall: vi.fn(),
  gatewayDailyActivityCall: vi.fn(),
  requestErrorActivityCall: vi.fn(),
  tagListCall: vi.fn(),
}));

// Mock child components to simplify testing
vi.mock("@/components/activity_metrics", () => ({
  ActivityMetrics: ({ modelMetrics }: { modelMetrics?: Record<string, { label: string }> }) => (
    <div>
      {Object.entries(modelMetrics ?? {}).map(([model, metrics]) => (
        <span key={model}>{metrics.label}</span>
      ))}
    </div>
  ),
  processActivityData: vi.fn(),
}));

vi.mock("@/components/view_user_spend", () => ({
  default: () => <div>View User Spend</div>,
}));

vi.mock("@/components/UsagePage/components/EntityUsage/TopKeyView", () => ({
  default: () => <div>Top Keys</div>,
}));

vi.mock("./EntityUsage/EntityUsage", async () => {
  const React = await import("react");
  const EntityUsage = ({
    entityType,
    entityList,
    selectedEntities,
    onSelectedEntitiesChange,
  }: {
    entityType: string;
    entityList: unknown;
    selectedEntities: readonly string[];
    onSelectedEntitiesChange: (ids: readonly string[]) => void;
  }) => {
    React.useEffect(() => {
      mockEntityUsageMounted(entityType);
    }, [entityType]);
    return (
      <div
        data-testid="entity-usage"
        data-entity-type={entityType}
        data-entity-list={JSON.stringify(entityList ?? null)}
        data-selected={JSON.stringify(selectedEntities)}
      >
        Entity Usage
        <button type="button" onClick={() => onSelectedEntitiesChange(["picked-1", "picked-2"])}>
          pick entities
        </button>
      </div>
    );
  };
  return { default: EntityUsage, EntityList: [] };
});

vi.mock("./EntityUsage/SpendByProvider", () => ({
  default: () => <div>Spend By Provider</div>,
}));

vi.mock("./EndpointUsage/EndpointUsage", () => ({
  default: () => <div>Endpoint Usage</div>,
}));

vi.mock("./UsageViewSelect/UsageViewSelect", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./UsageViewSelect/UsageViewSelect")>();
  const React = await import("react");
  const UsageViewSelect = ({
    value,
    onChange,
    canViewTagUsage = false,
  }: {
    value: string;
    onChange?: (value: string) => void;
    canViewTagUsage?: boolean;
  }) => {
    const tagOption = canViewTagUsage ? React.createElement("option", { value: "tag" }, "Tag Usage") : null;
    const selectProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value),
      role: "combobox",
      "data-testid": "usage-view-select",
    };
    return React.createElement(
      "select",
      selectProps,
      React.createElement("option", { value: "global" }, "Global Usage"),
      React.createElement("option", { value: "team" }, "Team Usage"),
      React.createElement("option", { value: "organization" }, "Organization Usage"),
      React.createElement("option", { value: "customer" }, "客户用量"),
      tagOption,
      React.createElement("option", { value: "agent" }, "Agent Usage"),
      React.createElement("option", { value: "user" }, "User Usage"),
      React.createElement("option", { value: "user-agent-activity" }, "User Agent Activity"),
    );
  };
  UsageViewSelect.displayName = "UsageViewSelect";
  return { ...actual, UsageViewSelect };
});

vi.mock("@/components/shared/advanced_date_picker", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/shared/advanced_date_picker")>();
  const React = await import("react");
  // The button is how a test drives a range change; the real picker's own UI is
  // not what any test here is asserting on.
  const AdvancedDatePicker = ({
    onValueChange,
  }: {
    onValueChange?: (value: unknown, presetShortLabel: string | null) => void;
  }) =>
    React.createElement(
      "div",
      { "data-testid": "advanced-date-picker" },
      "Date Picker",
      React.createElement(
        "button",
        {
          "data-testid": "pick-a-different-range",
          onClick: () =>
            onValueChange?.(
              { from: new Date(2024, 0, 1, 0, 0, 0, 0), to: new Date(2024, 0, 8, 23, 59, 59, 999) },
              null,
            ),
        },
        "pick",
      ),
    );
  AdvancedDatePicker.displayName = "AdvancedDatePicker";
  return { ...actual, default: AdvancedDatePicker };
});

vi.mock("@/components/user_agent_activity", () => ({
  default: ({
    selectedTags,
    onSelectedTagsChange,
  }: {
    selectedTags?: readonly string[];
    onSelectedTagsChange?: (tags: readonly string[]) => void;
  }) => (
    <div data-testid="user-agent-activity" data-selected-tags={JSON.stringify(selectedTags ?? [])}>
      User Agent Activity
      <button type="button" onClick={() => onSelectedTagsChange?.(["User-Agent: Firefox/2.0"])}>
        Select agent tag
      </button>
    </div>
  ),
}));

vi.mock("@/components/cloudzero_export_modal", () => ({
  default: () => <div>CloudZero Export Modal</div>,
}));

vi.mock("@/components/EntityUsageExport", () => ({
  default: () => <div>Entity Usage Export Modal</div>,
}));

vi.mock("./UsageAIChatPanel", () => ({
  default: () => <div data-testid="usage-ai-chat-panel">Usage AI Chat Panel</div>,
}));

vi.mock("@/app/(dashboard)/hooks/customers/useCustomers", () => ({
  useCustomers: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/agents/useAgents", () => ({
  useAgents: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/useIsOrgAdmin", () => ({
  __esModule: true,
  default: vi.fn(() => false),
}));

vi.mock("@/app/(dashboard)/hooks/organizations/useOrganizations", () => ({
  useOrganizations: vi.fn(() => ({ data: undefined, isPending: true, isLoading: false })),
}));

vi.mock("@/app/(dashboard)/hooks/users/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/users/useUsers", () => ({
  useInfiniteUsers: vi.fn(),
  useUserLookup: vi.fn(() => ({ data: null })),
}));

describe("UsagePage", () => {
  const mockUserDailyActivityAggregatedCall = vi.fn();
  const mockDailyActivityAggregatedCall = vi.mocked(networking.dailyActivityAggregatedCall);
  const mockDailyActivityKeyPageCall = vi.mocked(networking.dailyActivityKeyPageCall);
  const mockUserDailyActivityUserPageCall = vi.mocked(networking.userDailyActivityUserPageCall);
  const mockTagListCall = vi.mocked(networking.tagListCall);
  const mockGatewayDailyActivityCall = vi.mocked(networking.gatewayDailyActivityCall);
  const mockRequestErrorActivityCall = vi.mocked(networking.requestErrorActivityCall);
  const mockUseCustomers = vi.mocked(useCustomers);
  const mockUseAgents = vi.mocked(useAgents);
  const mockUseAuthorized = vi.mocked(useAuthorized);
  const mockUseCurrentUser = vi.mocked(useCurrentUser);
  const mockUseInfiniteUsers = vi.mocked(useInfiniteUsers);

  const mockSpendData = {
    results: [
      {
        date: "2025-01-01",
        metrics: {
          spend: 125.75,
          api_requests: 1500,
          successful_requests: 1450,
          failed_requests: 50,
          total_tokens: 75000,
          prompt_tokens: 45000,
          completion_tokens: 30000,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
        breakdown: {
          models: {
            "gpt-4": {
              metrics: {
                spend: 75.5,
                api_requests: 800,
                successful_requests: 780,
                failed_requests: 20,
                total_tokens: 40000,
                prompt_tokens: 24000,
                completion_tokens: 16000,
                cache_read_input_tokens: 0,
                cache_creation_input_tokens: 0,
              },
              metadata: {},
              api_key_breakdown: {},
            },
          },
          model_groups: {
            "gpt-4": {
              metrics: {
                spend: 75.5,
                api_requests: 800,
                successful_requests: 780,
                failed_requests: 20,
                total_tokens: 40000,
                prompt_tokens: 24000,
                completion_tokens: 16000,
                cache_read_input_tokens: 0,
                cache_creation_input_tokens: 0,
              },
              metadata: {},
              api_key_breakdown: {},
            },
          },
          api_keys: {
            "sk-test123": {
              metrics: {
                spend: 125.75,
                api_requests: 1500,
                successful_requests: 1450,
                failed_requests: 50,
                total_tokens: 75000,
                prompt_tokens: 45000,
                completion_tokens: 30000,
                cache_read_input_tokens: 0,
                cache_creation_input_tokens: 0,
              },
              metadata: {
                key_alias: "测试密钥",
                tags: ["production"],
              },
            },
          },
          providers: {
            openai: {
              metrics: {
                spend: 125.75,
                api_requests: 1500,
                successful_requests: 1450,
                failed_requests: 50,
                total_tokens: 75000,
                prompt_tokens: 45000,
                completion_tokens: 30000,
                cache_read_input_tokens: 0,
                cache_creation_input_tokens: 0,
              },
            },
          },
          mcp_servers: {},
        },
      },
    ],
    metadata: {
      total_spend: 125.75,
      total_api_requests: 1500,
      total_successful_requests: 1450,
      total_failed_requests: 50,
      total_tokens: 75000,
    },
  };

  const mockOrganizations: Organization[] = [
    {
      organization_id: "org-123",
      organization_alias: "Acme Org",
      budget_id: "budget-1",
      metadata: {},
      models: [],
      spend: 0,
      model_spend: {},
      created_at: "2025-01-01T00:00:00Z",
      created_by: "user-123",
      updated_at: "2025-01-02T00:00:00Z",
      updated_by: "user-123",
      litellm_budget_table: null,
      teams: null,
      users: null,
      members: null,
    },
  ];

  const mockCustomers = [
    {
      user_id: "customer-123",
      alias: "Test Customer",
      spend: 0,
      blocked: false,
      allowed_model_region: null,
      default_model: null,
      budget_id: null,
      litellm_budget_table: null,
    },
  ];

  const mockAgents = [
    {
      agent_id: "agent-123",
      agent_name: "Test Agent",
    },
  ];

  // The same session the suite runs as, minus the admin role. Named rather than
  // inlined so the test reads as "this session, but not an admin".
  const nonAdminSession = {
    isLoading: false,
    isAuthorized: true,
    token: "mock-token",
    accessToken: "test-token",
    userId: "user-123",
    userEmail: "test@example.com",
    userRole: "Internal User",
    userRoleLabel: "Internal User",
    isViewOnly: false,
    loginMethod: null,
    premiumUser: true,
    disabledPersonalKeyCreation: false,
    passwordResetRequired: false,
    showSSOBanner: false,
  };

  // Counts deliberately unlike anything in mockSpendData: the gateway tile must be
  // readable as coming from /gateway/daily/activity and from nothing else.
  const mockRequestErrorActivity = {
    total_successful_requests: 900,
    total_failed_requests: 100,
    by_date: [
      {
        date: "2025-01-01",
        successful_requests: 900,
        failed_requests: 100,
        client_errors: 90,
        server_errors: 10,
        by_status_code: [
          { status_code: 429, failed_requests: 90 },
          { status_code: 500, failed_requests: 10 },
        ],
      },
    ],
    by_status_code: [
      { status_code: 429, failed_requests: 90 },
      { status_code: 500, failed_requests: 10 },
    ],
    by_key: [
      {
        id: "hash-1",
        label: "prod-key",
        api_requests: 400,
        failed_requests: 100,
        top_status_code: 429,
        top_status_code_requests: 90,
      },
    ],
    by_team: [],
    by_user: [],
    by_model: [],
  };

  const mockGatewayActivity = {
    total_successful_requests: 424242,
    total_failed_requests: 909,
    by_date: [{ date: "2025-01-01", successful_requests: 424242, failed_requests: 909 }],
    by_route: [{ category: "llm", route: "/chat/completions", successful_requests: 424242, failed_requests: 909 }],
    by_status_code: [
      { status_code: 429, failed_requests: 3 },
      { status_code: 500, failed_requests: 2 },
    ],
  };

  const defaultProps = {
    teams: [
      {
        team_id: "team-1",
        team_alias: "Test Team",
        models: [],
        max_budget: null,
        spend: 0,
        tpm_limit: null,
        rpm_limit: null,
        blocked: false,
        metadata: {},
        budget_duration: null,
        organization_id: "org-123",
        created_at: "2025-01-01T00:00:00Z",
        keys: [],
        members_with_roles: [],
      },
    ],
    organizations: [],
  };

  beforeEach(() => {
    mockUseAuthorized.mockReturnValue(authorizedSession(SESSION_OVERRIDE_1));
    mockUseCurrentUser.mockReturnValue({
      data: {
        user_id: "user-123",
        max_budget: null,
      },
      isLoading: false,
      error: null,
    } as any);
    mockUserDailyActivityAggregatedCall.mockClear();
    mockDailyActivityAggregatedCall.mockReset();
    mockDailyActivityKeyPageCall.mockReset();
    mockDailyActivityKeyPageCall.mockResolvedValue({
      api_keys: [],
      total_api_keys: 0,
      offset: 0,
      limit: 50,
    });
    mockUserDailyActivityUserPageCall.mockReset();
    mockUserDailyActivityUserPageCall.mockResolvedValue({
      users: [],
      total_users: 0,
      offset: 0,
      limit: 50,
    });
    mockDailyActivityAggregatedCall.mockImplementation((entity: string, request: unknown) =>
      entity === "user" ? mockUserDailyActivityAggregatedCall(request) : Promise.resolve({ results: [], metadata: {} }),
    );
    mockEntityUsageMounted.mockClear();
    mockTagListCall.mockClear();
    mockGatewayDailyActivityCall.mockClear();
    mockUserDailyActivityAggregatedCall.mockResolvedValue(mockSpendData);
    mockGatewayDailyActivityCall.mockResolvedValue(mockGatewayActivity);
    mockRequestErrorActivityCall.mockClear();
    mockRequestErrorActivityCall.mockResolvedValue(mockRequestErrorActivity);
    mockUseInfiniteUsers.mockReturnValue({
      data: {
        pages: [
          {
            users: [
              { user_id: "user-001", user_alias: "Alice", user_email: "alice@example.com" },
              { user_id: "user-002", user_alias: null, user_email: "bob@example.com" },
              { user_id: "user-003", user_alias: null, user_email: null },
            ],
            page: 1,
            total_pages: 1,
            total_count: 3,
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    } as any);
    mockTagListCall.mockResolvedValue({});
    mockUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    mockUseAgents.mockReturnValue({
      data: { agents: [] },
      isLoading: false,
      error: null,
    } as any);
  });

  it("should render and fetch usage data on mount", async () => {
    renderWithProviders(<UsagePage {...defaultProps} />);

    // Wait for data to be fetched
    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    // Check that key metrics are displayed
    const totalRequestElements = screen.getAllByText("总请求数");
    expect(totalRequestElements.length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(overview().getAllByText("424,242").length).toBeGreaterThan(0);
    });
    expect(overview().getAllByText("909").length).toBeGreaterThan(0);
    expect(overview().getByText("425,151")).toBeInTheDocument();
    // Successful and failed counts now sit under Total Requests rather than in their own tiles.
    expect(totalRequestsCell()).toHaveTextContent("425,151");
    expect(totalRequestsCell()).toHaveTextContent("424,242 正常");
    expect(totalRequestsCell()).toHaveTextContent("909 失败");
    expect(overview().queryByText("1,500")).not.toBeInTheDocument();
    expect(overview().queryByText("1,450")).not.toBeInTheDocument();
  });

  it("should stop showing the previous range's totals while a new range is in flight", async () => {
    // The request tiles read the gateway counts and fall through to the
    // spend-derived ones. Withholding a superseded gateway result is only worth
    // something if the fallback is withheld too, otherwise the tile keeps
    // showing the previous range's number by the other route.
    let releaseSecondFetch: () => void = () => {};
    mockUserDailyActivityAggregatedCall.mockReset();
    mockUserDailyActivityAggregatedCall.mockResolvedValueOnce(mockSpendData).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          releaseSecondFetch = () => resolve(mockSpendData);
        }),
    );

    renderWithProviders(<UsagePage {...defaultProps} />);
    // Total Tokens reads compact (75K); the exact count stays on hover.
    await waitFor(() => {
      expect(overview().getAllByText("75K").length).toBeGreaterThan(0);
    });
    expect(overview().getByTitle("75,000 个令牌")).toHaveTextContent("75K");

    await act(async () => {
      fireEvent.click(screen.getByTestId("pick-a-different-range"));
    });

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByText("75,000")).not.toBeInTheDocument();
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();
    expect(screen.getByText("总令牌数")).toBeInTheDocument();
    expect(await screen.findByText("425,151")).toBeInTheDocument();
    expect(screen.getByText("总令牌数").parentElement?.parentElement).not.toHaveTextContent(/\d/);
    expect(screen.queryByText("$0.0000")).not.toBeInTheDocument();

    await act(async () => {
      releaseSecondFetch();
    });
    await waitFor(() => {
      expect(overview().getAllByText("75K").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("总令牌数")).toBeInTheDocument();
    expect(screen.getAllByText("$0.0838").length).toBeGreaterThan(0);
  });

  it("loads key pages separately from the aggregate and refreshes them when the range changes", async () => {
    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("密钥活动"));
    await waitFor(() => {
      expect(mockDailyActivityKeyPageCall).toHaveBeenCalledWith("user", expect.any(Object), 0, 50);
    });
    expect(mockUserDailyActivityAggregatedCall.mock.lastCall?.[0]).not.toHaveProperty("apiKeyLimit");
    const pageCallsBeforeRangeChange = mockDailyActivityKeyPageCall.mock.calls.length;
    fireEvent.click(screen.getByTestId("pick-a-different-range"));

    await waitFor(() => {
      expect(mockDailyActivityKeyPageCall.mock.calls.length).toBeGreaterThan(pageCallsBeforeRangeChange);
    });
    expect(mockUserDailyActivityAggregatedCall.mock.lastCall?.[0]).not.toHaveProperty("apiKeyLimit");
  });

  it("should fall back to the spend-derived count when the gateway endpoint is unavailable", async () => {
    mockGatewayDailyActivityCall.mockRejectedValue(new Error("gateway activity unavailable"));

    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockGatewayDailyActivityCall).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(overview().getAllByText("1,450").length).toBeGreaterThan(0);
    });
    expect(overview().getByText("1,500")).toBeInTheDocument();
    expect(totalRequestsCell()).toHaveTextContent("1,500");
    expect(totalRequestsCell()).toHaveTextContent("1,450 正常");
    expect(totalRequestsCell()).toHaveTextContent("50 失败");
    expect(screen.queryByText("424,242")).not.toBeInTheDocument();
    expect(screen.queryByText("909")).not.toBeInTheDocument();
    expect(screen.queryByText("425,151")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gateway-requests-by-endpoint")).not.toBeInTheDocument();
  });

  it("should not request deployment-wide gateway counts for a non-admin", async () => {
    mockUseAuthorized.mockReturnValue(nonAdminSession);

    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });
    expect(mockGatewayDailyActivityCall).not.toHaveBeenCalled();
    expect(mockRequestErrorActivityCall).not.toHaveBeenCalled();
    expect(screen.queryByRole("tab", { name: "错误" })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(totalRequestsCell()).toHaveTextContent("1,500");
    });
    expect(screen.queryByText("424,242")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gateway-requests-by-endpoint")).not.toBeInTheDocument();
  });

  it("keeps failure analytics off the cost overview and on the Errors tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockRequestErrorActivityCall).toHaveBeenCalled();
    });
    expect(overview().queryByText(/Client errors \(4xx\)/)).not.toBeInTheDocument();
    expect(overview().queryByRole("button", { name: /Failed Requests/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "错误" }));
    const errorsTab = within(await screen.findByTestId("usage-errors-tab"));
    expect(await errorsTab.findByText("10.0%")).toBeInTheDocument();
    expect(errorsTab.getByRole("list", { name: "按状态码统计的失败请求" })).toHaveTextContent("429");
    const keys = errorsTab.getByRole("table", { name: "按失败请求数排名的虚拟密钥" });
    expect(within(keys).getAllByRole("row")[1]).toHaveTextContent("prod-key");
  });

  it("should display usage metrics and charts", async () => {
    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    // Check for usage metrics cards
    const totalRequestElements = screen.getAllByText("总请求数");
    expect(totalRequestElements.length).toBeGreaterThan(0);
    const totalTokensElements = screen.getAllByText("总令牌数");
    expect(totalTokensElements.length).toBeGreaterThan(0);

    // Check for chart titles (these are in the Cost tab)
    expect(screen.getByText("每日用量")).toBeInTheDocument();
    expect(screen.getByText("热门虚拟密钥")).toBeInTheDocument();
  });

  it("should render the top models chart stacked in the shared usage palette", async () => {
    const { container } = renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    // The gateway endpoint breakdown is a separate chart with its own palette,
    // so it is excluded rather than allowed to widen the expected fill set.
    const spendBars = () => {
      const gatewayCard = container.querySelector('[data-testid="gateway-requests-by-endpoint"]');
      return Array.from(container.querySelectorAll("path.recharts-rectangle")).filter(
        (rect) => !gatewayCard?.contains(rect),
      );
    };

    // One day stacked as the top model (gpt-4) over the "Other" remainder of that day's spend.
    await waitFor(() => {
      expect(spendBars()).toHaveLength(2);
    });

    const fills = new Set(spendBars().map((rect) => rect.getAttribute("fill")));
    expect(fills).toEqual(new Set([STACKED_USAGE_PALETTE[0], OTHER_COLOR]));

    expect(screen.getAllByText("1月1日").length).toBeGreaterThan(0);
    expect(screen.getAllByText("gpt-4").length).toBeGreaterThan(0);
  });

  it("should switch between usage views correctly", async () => {
    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    // Default view should show Global Usage (for admin)
    expect(screen.getByText("每日用量")).toBeInTheDocument();

    // Switch to Team Usage view
    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "team" } });
    });

    // Should render EntityUsage component
    await waitFor(() => {
      const entityUsageElements = screen.getAllByText("Entity Usage");
      expect(entityUsageElements.length).toBeGreaterThan(0);
    });

    // Switch to Tag Usage view (admin only)
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "tag" } });
    });

    // Should still render EntityUsage component for tags
    await waitFor(() => {
      const entityUsageElements = screen.getAllByText("Entity Usage");
      expect(entityUsageElements.length).toBeGreaterThan(0);
    });
  });

  it("should withhold the tag list until it resolves so no empty state is shown while loading", async () => {
    let resolveTagList: (tags: Record<string, unknown>) => void = () => {};
    mockTagListCall.mockReturnValue(
      new Promise((resolve) => {
        resolveTagList = resolve;
      }) as ReturnType<typeof networking.tagListCall>,
    );

    renderWithProviders(<UsagePage {...defaultProps} />);

    act(() => {
      fireEvent.change(screen.getByTestId("usage-view-select"), { target: { value: "tag" } });
    });

    const entityUsage = await screen.findByTestId("entity-usage");
    expect(entityUsage).toHaveAttribute("data-entity-list", "null");

    await act(async () => {
      resolveTagList({});
    });

    expect(screen.getByTestId("entity-usage")).toHaveAttribute("data-entity-list", "[]");
  });

  it("should drop the previous range's tags as soon as the range changes", async () => {
    mockTagListCall.mockResolvedValue({ "old-range-tag": { name: "old-range-tag" } } as never);

    renderWithProviders(<UsagePage {...defaultProps} />);

    act(() => {
      fireEvent.change(screen.getByTestId("usage-view-select"), { target: { value: "tag" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("entity-usage")).toHaveAttribute(
        "data-entity-list",
        JSON.stringify([{ label: "old-range-tag", value: "old-range-tag" }]),
      );
    });

    let resolveNewRange: (tags: Record<string, unknown>) => void = () => {};
    mockTagListCall.mockReturnValue(
      new Promise((resolve) => {
        resolveNewRange = resolve;
      }) as ReturnType<typeof networking.tagListCall>,
    );

    act(() => {
      fireEvent.click(screen.getByTestId("pick-a-different-range"));
    });

    expect(screen.getByTestId("entity-usage")).toHaveAttribute("data-entity-list", "null");

    await act(async () => {
      resolveNewRange({});
    });

    expect(screen.getByTestId("entity-usage")).toHaveAttribute("data-entity-list", "[]");
  });

  it("should show tag usage selector option for internal users", async () => {
    mockUseAuthorized.mockReturnValue(authorizedSession(SESSION_OVERRIDE_2));

    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    expect(screen.getByRole("option", { name: "Tag Usage" })).toBeInTheDocument();
  });

  it("should show organization usage banner and view for admins", async () => {
    renderWithProviders(<UsagePage {...defaultProps} organizations={mockOrganizations} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "organization" } });
    });

    await waitFor(() => {
      const entityUsageElements = screen.getAllByText("Entity Usage");
      expect(entityUsageElements.length).toBeGreaterThan(0);
    });
  });

  // Org-admin membership comes from the server, so it can be revoked while the
  // page is open. The Organization Usage option and its panel both disappear,
  // and without a fallback the selector keeps a value it no longer offers,
  // leaving the user on a blank trigger over a blank panel with nothing to
  // click. An internal user is used because that is the session role an org
  // admin actually carries.
  it("should leave the organization view when org-admin membership is revoked mid-session", async () => {
    const mockUseIsOrgAdmin = vi.mocked(useIsOrgAdmin);
    mockUseIsOrgAdmin.mockReturnValue(true);
    mockUseAuthorized.mockReturnValue({
      isLoading: false,
      isAuthorized: true,
      token: "mock-token",
      accessToken: "test-token",
      userId: "user-123",
      userEmail: "test@example.com",
      userRole: "Internal User",
      premiumUser: true,
      disabledPersonalKeyCreation: false,
      showSSOBanner: false,
    } as any);

    const { rerender } = renderWithProviders(<UsagePage {...defaultProps} organizations={mockOrganizations} />);

    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "organization" } });
    });
    await waitFor(() => {
      expect(screen.getAllByText("Entity Usage").length).toBeGreaterThan(0);
    });
    expect((usageSelect as HTMLSelectElement).value).toBe("organization");

    mockUseIsOrgAdmin.mockReturnValue(false);
    act(() => {
      rerender(<UsagePage {...defaultProps} organizations={mockOrganizations} />);
    });

    await waitFor(() => {
      expect((screen.getByTestId("usage-view-select") as HTMLSelectElement).value).toBe("global");
    });
  });

  it("should show customer usage view for admins", async () => {
    mockUseCustomers.mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "customer" } });
    });

    await waitFor(() => {
      const entityUsageElements = screen.getAllByText("Entity Usage");
      expect(entityUsageElements.length).toBeGreaterThan(0);
    });
  });

  it("should withhold the customer list while it is still loading", async () => {
    mockUseCustomers.mockReturnValue({ data: undefined, isLoading: true, error: null } as any);

    renderWithProviders(<UsagePage {...defaultProps} />);

    act(() => {
      fireEvent.change(screen.getByTestId("usage-view-select"), { target: { value: "customer" } });
    });

    const entityUsage = await screen.findByTestId("entity-usage");
    expect(entityUsage).toHaveAttribute("data-entity-list", "null");
  });

  it("should show agent usage view for admins", async () => {
    mockUseAgents.mockReturnValue({
      data: { agents: mockAgents },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<UsagePage {...defaultProps} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "agent" } });
    });

    await waitFor(() => {
      const entityUsageElements = screen.getAllByText("Entity Usage");
      expect(entityUsageElements.length).toBeGreaterThan(0);
    });
  });

  it.each(["organization", "agent"])("should not render the %s usage view for an internal user", async (usageView) => {
    mockUseAuthorized.mockReturnValue(nonAdminSession);
    mockDailyActivityKeyPageCall.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<UsagePage {...defaultProps} organizations={mockOrganizations} />);

    await waitFor(() => {
      expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
    });

    const usageSelect = screen.getByTestId("usage-view-select");
    act(() => {
      fireEvent.change(usageSelect, { target: { value: "team" } });
    });
    expect(screen.getAllByText("Entity Usage").length).toBeGreaterThan(0);

    act(() => {
      fireEvent.change(usageSelect, { target: { value: usageView } });
    });

    expect(screen.queryByText("Entity Usage")).not.toBeInTheDocument();
  });

  describe("non-admin user behavior", () => {
    it("should always pass own userId for non-admin users", async () => {
      mockUseAuthorized.mockReturnValue(authorizedSession(SESSION_OVERRIDE_4));

      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalledWith(
          expect.objectContaining({ accessToken: "test-token", entityIds: ["user-123"] }),
        );
      });
    });
  });

  describe("aggregated endpoint failure", () => {
    it("shows the failure alert instead of retrying other routes when the aggregated call fails", async () => {
      mockUserDailyActivityAggregatedCall.mockRejectedValue(new Error("Aggregated endpoint not available"));

      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });
      expect(mockDailyActivityAggregatedCall.mock.calls.filter((c) => c[0] === "user")).toHaveLength(1);
      expect(await screen.findByText(/消费数据拉取失败/)).toBeInTheDocument();
    });
  });

  describe("MCP Server Activity tab", () => {
    it("should render MCP Server Activity tab", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      // The tab list should contain MCP Server Activity
      expect(screen.getByText("MCP 服务器活动")).toBeInTheDocument();
    });
  });

  describe("User Agent Activity view", () => {
    it("should render User Agent Activity component when view is selected", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      const usageSelect = screen.getByTestId("usage-view-select");
      act(() => {
        fireEvent.change(usageSelect, { target: { value: "user-agent-activity" } });
      });

      await waitFor(() => {
        // "User Agent Activity" appears both in the select option and in the rendered component
        const elements = screen.getAllByText("User Agent Activity");
        expect(elements.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Export Data button", () => {
    it("should render Export Data button in global view for admin", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      expect(screen.getByText("导出数据")).toBeInTheDocument();
    });
  });

  describe("Ask AI button", () => {
    it("should render Ask AI button in global view", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      expect(screen.getByText("询问 AI")).toBeInTheDocument();
    });

    it("should render AI chat panel component", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      expect(screen.getByTestId("usage-ai-chat-panel")).toBeInTheDocument();
    });
  });

  describe("model view toggle", () => {
    it("should show Public Model Name view by default", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      // Default should be "groups" view showing "热门公开模型名"
      expect(screen.getByText("公开模型名")).toBeInTheDocument();
      expect(screen.getAllByText("公开模型名").length).toBeGreaterThan(0);
      expect(screen.getAllByText("LiteLLM 模型名").length).toBeGreaterThan(0);
    });

    it("should switch to Litellm Model Name view on toggle click", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      // Click the "LiteLLM 模型名" toggle
      const litellmToggle = screen.getAllByText("LiteLLM 模型名")[0];
      act(() => {
        fireEvent.click(litellmToggle);
      });

      // Title should change to "热门 Litellm 模型"
      await waitFor(() => {
        expect(screen.getByText("LiteLLM 模型名")).toBeInTheDocument();
      });
    });

    it("should switch back to Public Model Name view", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      // Switch to individual first
      const litellmToggle = screen.getAllByText("LiteLLM 模型名")[0];
      act(() => {
        fireEvent.click(litellmToggle);
      });

      await waitFor(() => {
        expect(screen.getByText("LiteLLM 模型名")).toBeInTheDocument();
      });

      // Switch back to groups
      const publicToggle = screen.getAllByText("公开模型名")[0];
      act(() => {
        fireEvent.click(publicToggle);
      });

      await waitFor(() => {
        expect(screen.getByText("公开模型名")).toBeInTheDocument();
      });
    });

    it("should feed the Model Activity tab from the model_groups breakdown by default", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      expect(vi.mocked(processActivityData)).toHaveBeenCalledWith(expect.anything(), "model_groups", expect.anything());
    });

    it("should switch the Model Activity tab to the litellm models breakdown on toggle click", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      act(() => {
        fireEvent.click(screen.getAllByText("LiteLLM 模型名")[0]);
      });

      await waitFor(() => {
        expect(vi.mocked(processActivityData)).toHaveBeenCalledWith(expect.anything(), "models", expect.anything());
      });
    });

    it("filters Model Activity by model name and shows an empty state when there are no matches", async () => {
      vi.mocked(processActivityData).mockReturnValue({
        "openai/gpt-4o": modelActivity("GPT-4o"),
        "anthropic/claude-3": modelActivity("Claude 3 Sonnet"),
      });
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });
      fireEvent.click(screen.getByRole("tab", { name: "模型活动" }));

      const modelActivityTab = screen.getByRole("tabpanel", { name: "模型活动" });
      const searchInput = within(modelActivityTab).getByRole("textbox", { name: "搜索模型" });
      fireEvent.change(searchInput, { target: { value: "GPT-4o" } });

      expect(within(modelActivityTab).getByText("GPT-4o")).toBeInTheDocument();
      expect(within(modelActivityTab).queryByText("Claude 3 Sonnet")).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: "missing model" } });

      expect(within(modelActivityTab).getByText("该时间范围内没有匹配「missing model」的模型")).toBeInTheDocument();
    });

    it("does not show the no-match state when model data is empty", async () => {
      vi.mocked(processActivityData).mockReturnValue({});
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });
      fireEvent.click(screen.getByRole("tab", { name: "模型活动" }));

      const modelActivityTab = screen.getByRole("tabpanel", { name: "模型活动" });
      const searchInput = within(modelActivityTab).getByRole("textbox", { name: "搜索模型" });
      fireEvent.change(searchInput, { target: { value: "missing model" } });

      expect(
        within(modelActivityTab).queryByText("该时间范围内没有匹配「missing model」的模型"),
      ).not.toBeInTheDocument();
    });
  });

  describe("customer usage banner", () => {
    it("should show and be dismissible in customer view", async () => {
      mockUseCustomers.mockReturnValue({
        data: mockCustomers,
        isLoading: false,
        error: null,
      } as any);

      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      const usageSelect = screen.getByTestId("usage-view-select");
      act(() => {
        fireEvent.change(usageSelect, { target: { value: "customer" } });
      });

      await waitFor(() => {
        const entityUsageElements = screen.getAllByText("Entity Usage");
        expect(entityUsageElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("agent usage banner", () => {
    it("should show agent usage banner with A2A info", async () => {
      mockUseAgents.mockReturnValue({
        data: { agents: mockAgents },
        isLoading: false,
        error: null,
      } as any);

      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      const usageSelect = screen.getByTestId("usage-view-select");
      act(() => {
        fireEvent.change(usageSelect, { target: { value: "agent" } });
      });

      await waitFor(() => {
        const entityUsageElements = screen.getAllByText("Entity Usage");
        expect(entityUsageElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("tab navigation in global view", () => {
    it("should render all expected tabs", async () => {
      renderWithProviders(<UsagePage {...defaultProps} />);

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });

      expect(screen.getByText("概览")).toBeInTheDocument();
      expect(screen.getByText("模型活动")).toBeInTheDocument();
      expect(screen.getByText("密钥活动")).toBeInTheDocument();
      expect(screen.getByText("MCP 服务器活动")).toBeInTheDocument();
      expect(screen.getByText("端点活动")).toBeInTheDocument();
    });
  });
  describe("URL state", () => {
    const renderAt = (searchParams: string) => {
      const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
      const view = renderWithProviders(<UsagePage {...defaultProps} />, {
        searchParams,
        onUrlUpdate,
        resetUrlUpdateQueueOnMount: false,
      });
      const lastQuery = (): string | undefined => onUrlUpdate.mock.lastCall?.[0].queryString;
      return { ...view, onUrlUpdate, lastQuery };
    };

    it("preselects the user filter from ?user= and links back to that user's record", async () => {
      renderAt("?user=user-001");

      const expectedRequest = {
        accessToken: "test-token",
        endTime: expect.any(Date),
        entityIds: ["user-001"],
        startTime: expect.any(Date),
      };
      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalledWith(expect.objectContaining(expectedRequest));
      });
      expect(screen.getByRole("link", { name: "查看用户记录" })).toHaveAttribute("href", "/ui/users?user=user-001");
    });

    it("shows no user record link while the global view is unfiltered", async () => {
      renderAt("");

      const expectedRequest = {
        accessToken: "test-token",
        endTime: expect.any(Date),
        entityIds: null,
        startTime: expect.any(Date),
      };
      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalledWith(expect.objectContaining(expectedRequest));
      });
      expect(screen.queryByRole("link", { name: "查看用户记录" })).not.toBeInTheDocument();
    });

    it("opens the linked entity view with its selection and writes new picks back", async () => {
      const { lastQuery } = renderAt("?view=team&team=team-1");

      const entityUsage = await screen.findByTestId("entity-usage");
      expect(entityUsage).toHaveAttribute("data-entity-type", "team");
      expect(entityUsage).toHaveAttribute("data-selected", JSON.stringify(["team-1"]));

      fireEvent.click(screen.getByRole("button", { name: "pick entities" }));

      await waitFor(() => {
        expect(lastQuery()).toBe("?view=team&team=picked-1&team=picked-2");
      });
    });

    it("writes the chosen view and drops the previous view's filters", async () => {
      const { lastQuery } = renderAt("?user=user-001&tab=keys&range=30d");

      fireEvent.change(screen.getByTestId("usage-view-select"), { target: { value: "customer" } });

      await waitFor(() => {
        expect(lastQuery()).toBe("?range=30d&view=customer");
      });
    });

    it("restores the inner tab from the URL and writes tab changes", async () => {
      const { lastQuery } = renderAt("?tab=models");

      expect(await screen.findByRole("tab", { name: "模型活动" })).toHaveAttribute("aria-selected", "true");

      fireEvent.click(screen.getByRole("tab", { name: "密钥活动" }));

      await waitFor(() => {
        expect(lastQuery()).toBe("?tab=keys");
      });
    });

    it.each([
      ["users", "用户活动"],
      ["errors", "错误"],
    ])("restores the %s tab from the URL", async (tab, label) => {
      renderAt(`?tab=${tab}`);

      expect(await screen.findByRole("tab", { name: label })).toHaveAttribute("aria-selected", "true");
    });

    it("renders User Agent Activity from the URL and writes selected tags back", async () => {
      const { lastQuery } = renderAt("?view=user-agent-activity&tag=User-Agent%3A+Chrome%2F1.0");
      const activity = await screen.findByTestId("user-agent-activity");

      expect(activity).toHaveAttribute("data-selected-tags", JSON.stringify(["User-Agent: Chrome/1.0"]));
      fireEvent.click(screen.getByRole("button", { name: "Select agent tag" }));

      await waitFor(() => {
        expect(lastQuery()).toContain("tag=User-Agent");
      });
      expect(await screen.findByTestId("user-agent-activity")).toHaveAttribute(
        "data-selected-tags",
        JSON.stringify(["User-Agent: Firefox/2.0"]),
      );
    });

    it("fetches the custom range in the URL and writes a newly picked one", async () => {
      const { lastQuery } = renderAt("?from=2025-03-01&to=2025-03-05");

      const expectedRequest = {
        accessToken: "test-token",
        endTime: new Date(2025, 2, 5, 23, 59, 59, 999),
        entityIds: null,
        startTime: new Date(2025, 2, 1, 0, 0, 0, 0),
      };
      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalledWith(expect.objectContaining(expectedRequest));
      });

      fireEvent.click(screen.getByTestId("pick-a-different-range"));

      await waitFor(() => {
        expect(lastQuery()).toBe("?from=2024-01-01&to=2024-01-08");
      });
    });

    it("tells a viewer they lack access and sends them to the default view", async () => {
      const warning = vi.spyOn(toast, "warning");
      mockUseAuthorized.mockReturnValue(nonAdminSession);

      renderAt("?view=organization&org=org-1&range=30d");

      await waitFor(() => {
        expect(warning).toHaveBeenCalledWith("您无权查看该用量视图", {
          id: "usage-url-access-denied",
        });
      });
      expect(screen.queryByTestId("entity-usage")).not.toBeInTheDocument();
    });

    it("does not render a disallowed customer view for an internal user", async () => {
      mockUseAuthorized.mockReturnValue(nonAdminSession);

      renderAt("?view=customer&customer=c-1");

      await waitFor(() => {
        expect(mockUserDailyActivityAggregatedCall).toHaveBeenCalled();
      });
      expect(mockEntityUsageMounted).not.toHaveBeenCalledWith("customer");
      expect(screen.queryByTestId("entity-usage")).not.toBeInTheDocument();
    });

    it("does not select the admin-only Errors tab for an internal user", async () => {
      mockUseAuthorized.mockReturnValue(nonAdminSession);

      renderAt("?tab=errors");

      expect(await screen.findByRole("tab", { name: "概览" })).toHaveAttribute("aria-selected", "true");
      expect(screen.queryByRole("tab", { name: "错误" })).not.toBeInTheDocument();
    });

    it("never fetches another user's usage for a non-admin who opens their link", async () => {
      const warning = vi.spyOn(toast, "warning");
      mockUseAuthorized.mockReturnValue(nonAdminSession);

      renderAt("?user=user-001");

      await waitFor(() => {
        expect(warning).toHaveBeenCalledWith("您无权查看该用量视图", {
          id: "usage-url-access-denied",
        });
      });
      expect(mockUserDailyActivityAggregatedCall).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        "user-001",
      );
    });

    it("copies the current page URL as the share link", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
      renderAt("?tab=models");

      fireEvent.click(await screen.findByRole("button", { name: "复制分享链接" }));

      await waitFor(() => {
        expect(writeText).toHaveBeenCalledWith(window.location.href);
      });
    });

    it("shows the share link on an entity view", async () => {
      renderAt("?view=team");

      expect(await screen.findByRole("button", { name: "复制分享链接" })).toBeInTheDocument();
    });
  });
});
