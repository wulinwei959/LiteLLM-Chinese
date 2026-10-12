import { screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { vi, it, expect, beforeEach, describe, Mock, MockedFunction } from "vitest";
import { chooseSelectOption, renderWithProviders } from "../../../tests/test-utils";
import { VirtualKeysTable } from "./VirtualKeysTable";
import { KEY_TABLE_HIDDEN_COLUMNS, KEY_TABLE_SORT_FIELDS } from "./keyTableColumns";
import { KeyResponse, Team } from "../key_team_helpers/key_list";
import { useKeyInfo } from "@/app/(dashboard)/hooks/keys/useKeyInfo";
import { KeysResponse, useKeys } from "@/app/(dashboard)/hooks/keys/useKeys";
import useTeams from "@/app/(dashboard)/hooks/useTeams";
import { regenerateKeyCall } from "../networking";

// Mock next-intl translations for tests
const mockTranslations: Record<string, string> = {
  "virtualKeys.title": "Virtual Keys",
  "virtualKeys.description": "Every key that authenticates requests to the gateway.",
  "virtualKeys.loading": "Loading...",
  "virtualKeys.noKeysFound": "No keys found",
  "virtualKeys.searchPlaceholder": "Search by key alias or ID…",
  "virtualKeys.filters": "Filters",
  "virtualKeys.filtersDescription": "Narrow down virtual keys",
  "virtualKeys.filter.team": "Team",
  "virtualKeys.filter.organization": "Organization",
  "virtualKeys.filter.userId": "User ID",
  "virtualKeys.filter.keyId": "Key ID",
  "virtualKeys.filter.status": "Status",
  "virtualKeys.filter.allStatuses": "All statuses",
  "virtualKeys.placeholder.team": "Select a team…",
  "virtualKeys.placeholder.organization": "Select an organization…",
  "virtualKeys.placeholder.userId": "Enter User ID…",
  "virtualKeys.placeholder.keyId": "Enter Key ID…",
  "virtualKeys.empty.team": "No teams found",
  "virtualKeys.empty.organization": "No organizations found",
  "virtualKeys.status.active": "Active",
  "virtualKeys.status.expired": "Expired",
  "virtualKeys.status.blocked": "Blocked",
  "virtualKeys.status.deleted": "Deleted",
  "virtualKeys.statusBlockedScimTooltip": "Blocked by SCIM (external identity provider deactivated or deleted the owning user).",
  "virtualKeys.statusBlockedTooltip": "Blocked. Requests using this key will be rejected with 401.",
  "virtualKeys.statusExpiredTooltip": "This key has passed its expiry date.",
  "virtualKeys.statusActiveTooltip": "This key is not blocked and has not expired.",
  "virtualKeys.statusDeletedTooltip": "Deleted {date}{by}. Kept for audit and spend history; requests using this key are rejected.",
  "virtualKeys.columns.key": "Key",
  "virtualKeys.columns.keyId": "Key ID",
  "virtualKeys.columns.team": "Team",
  "virtualKeys.columns.organization": "Organization",
  "virtualKeys.columns.user": "User",
  "virtualKeys.columns.userTooltip": "Displays the first available value: User Alias, User Email, or User ID.",
  "virtualKeys.columns.createdAt": "Created At",
  "virtualKeys.columns.createdBy": "Created By",
  "virtualKeys.columns.updatedAt": "Updated At",
  "virtualKeys.columns.lastActive": "Last Active",
  "virtualKeys.columns.lastActiveTooltip": "This is a new field and is not backfilled. Only new key usage will update this value.",
  "virtualKeys.columns.expires": "Expires",
  "virtualKeys.columns.spendBudget": "Spend / Budget",
  "virtualKeys.columns.lifetimeSpend": "Lifetime Spend",
  "virtualKeys.columns.lifetimeSpendTooltip": "Cumulative spend across every budget period. Budget resets do not touch this value. Lifetime tracking started with LiteLLM v1.103.0 on September 19, 2026, so keys created earlier only count spend since that upgrade.",
  "virtualKeys.columns.budgetReset": "Budget Reset",
  "virtualKeys.columns.models": "Models",
  "virtualKeys.columns.tpm": "TPM",
  "virtualKeys.columns.rpm": "RPM",
  "virtualKeys.columns.rateLimits": "Rate Limits",
  "virtualKeys.common.never": "Never",
  "virtualKeys.common.unknown": "Unknown",
  "virtualKeys.common.unlimited": "Unlimited",
  "virtualKeys.status": "Status",
  "virtualKeys.active": "Active",
  "virtualKeys.expired": "Expired",
  "virtualKeys.blocked": "Blocked",
  "virtualKeys.deleted": "Deleted",
  "virtualKeys.allStatuses": "All statuses",
  "virtualKeys.statusBlockedScimTooltip": "Blocked by SCIM (external identity provider deactivated or deleted the owning user).",
  "virtualKeys.statusBlockedTooltip": "Blocked. Requests using this key will be rejected with 401.",
  "virtualKeys.statusExpiredTooltip": "This key has passed its expiry date.",
  "virtualKeys.statusActiveTooltip": "This key is not blocked and has not expired.",
  "virtualKeys.statusDeletedTooltip": "Deleted {date}{by}. Kept for audit and spend history; requests using this key are rejected.",
};

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => mockTranslations[`${namespace}.${key}`] ?? mockTranslations[key] ?? key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Resolve debounced values synchronously so an applied filter lands in the useKeys query within the test tick.
vi.mock("@tanstack/react-pacer/debouncer", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    useDebouncedValue: (value: unknown) => [value, { cancel: vi.fn(), flush: vi.fn() }],
    useDebouncedState: (initial: unknown) => {
      const [value, setValue] = React.useState(initial);
      return [value, setValue, { cancel: vi.fn(), flush: vi.fn() }];
    },
    useDebouncedCallback: (fn: (...args: unknown[]) => void) => fn,
    useDebouncer: (fn: (...args: unknown[]) => void) => ({ maybeExecute: fn, cancel: vi.fn(), flush: vi.fn() }),
  };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock("../networking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../networking")>()),
  regenerateKeyCall: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: vi.fn(() => ({
    accessToken: "test-token",
    userId: "test-user",
    userRole: "Admin",
    premiumUser: true,
    token: "test-token",
  })),
}));

vi.mock("@/app/(dashboard)/hooks/teams/useTeams", () => ({
  useAllTeams: vi.fn(() => ({
    data: [{ team_id: "team-1", team_alias: "Test Team" }],
    isLoading: false,
  })),
}));

vi.mock("@/app/(dashboard)/hooks/keys/useKeys", () => ({
  useKeys: vi.fn(),
  keyKeys: { lists: () => ["keys", "list"] },
}));

vi.mock("@/app/(dashboard)/hooks/keys/useKeyInfo", () => ({
  useKeyInfo: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/uiSettings/useApplyUserBudgetToTeamKeys", () => ({
  useApplyUserBudgetToTeamKeys: vi.fn(() => false),
}));

vi.mock("@/app/(dashboard)/hooks/useTeams", () => ({
  default: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/organizations/useOrganizations", () => ({
  useOrganizations: vi.fn().mockReturnValue({
    data: [
      {
        organization_id: "org-1",
        organization_alias: "Test Organization",
      },
    ],
  }),
}));

// Resolve debounced values synchronously so an applied filter lands in the useKeys query within the test tick.
vi.mock("@tanstack/react-pacer/debouncer", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    useDebouncedValue: (value: unknown) => [value, { cancel: vi.fn(), flush: vi.fn() }],
    useDebouncedState: (initial: unknown) => {
      const [value, setValue] = React.useState(initial);
      return [value, setValue, { cancel: vi.fn(), flush: vi.fn() }];
    },
    useDebouncedCallback: (fn: (...args: unknown[]) => void) => fn,
    useDebouncer: (fn: (...args: unknown[]) => void) => ({ maybeExecute: fn, cancel: vi.fn(), flush: vi.fn() }),
  };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock("../networking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../networking")>()),
  regenerateKeyCall: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: vi.fn(() => ({
    accessToken: "test-token",
    userId: "test-user",
    userRole: "Admin",
    premiumUser: true,
    token: "test-token",
  })),
}));

vi.mock("@/app/(dashboard)/hooks/teams/useTeams", () => ({
  useAllTeams: vi.fn(() => ({
    data: [{ team_id: "team-1", team_alias: "Test Team" }],
    isLoading: false,
  })),
}));

vi.mock("@/app/(dashboard)/hooks/keys/useKeys", () => ({
  useKeys: vi.fn(),
  keyKeys: { lists: () => ["keys", "list"] },
}));

vi.mock("@/app/(dashboard)/hooks/keys/useKeyInfo", () => ({
  useKeyInfo: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/uiSettings/useApplyUserBudgetToTeamKeys", () => ({
  useApplyUserBudgetToTeamKeys: vi.fn(() => false),
}));

vi.mock("@/app/(dashboard)/hooks/useTeams", () => ({
  default: vi.fn(),
}));

vi.mock("@/app/(dashboard)/hooks/organizations/useOrganizations", () => ({
  useOrganizations: vi.fn().mockReturnValue({
    data: [
      {
        organization_id: "org-1",
        organization_alias: "Test Organization",
      },
    ],
  }),
}));

const mockKey: KeyResponse = {
  token: "88a145505dd6e87e2ea166fcef1e4b53948dbdb32af6431dfd05ec06b571ee52",
  token_id: "key-1",
  key_name: "test-key",
  key_alias: "Test Key Alias",
  spend: 5.5,
  total_spend: 42.25,
  max_budget: 100,
  expires: "2999-12-31T23:59:59Z",
  models: ["gpt-3.5-turbo", "gpt-4"],
  aliases: {},
  config: {},
  user_id: "user-1",
  team_id: "team-1",
  project_id: null,
  max_parallel_requests: 10,
  metadata: {},
  tpm_limit: 1000,
  rpm_limit: 100,
  duration: "30d",
  budget_duration: "1m",
  budget_reset_at: "2024-12-01T00:00:00Z",
  allowed_cache_controls: [],
  allowed_routes: [],
  permissions: {},
  model_spend: { "gpt-3.5-turbo": 2.5, "gpt-4": 3.0 },
  model_max_budget: { "gpt-3.5-turbo": 50, "gpt-4": 50 },
  soft_budget_cooldown: false,
  blocked: false,
  litellm_budget_table: {},
  organization_id: "org-1",
  created_at: "2024-11-01T10:00:00Z",
  created_by: "user-1",
  updated_at: "2024-11-15T10:00:00Z",
  last_active: "2024-11-20T14:30:00Z",
  team_spend: 5.5,
  team_alias: "Test Team",
  team_tpm_limit: 5000,
  team_rpm_limit: 500,
  team_max_budget: 500,
  team_models: ["gpt-3.5-turbo", "gpt-4"],
  team_blocked: false,
  soft_budget: 50,
  team_model_aliases: {},
  team_member_spend: 0,
  team_metadata: {},
  end_user_id: "end-user-1",
  end_user_tpm_limit: 100,
  end_user_rpm_limit: 10,
  end_user_max_budget: 10,
  last_refreshed_at: Date.now(),
  api_key: "88a145505dd6e87e2ea166fcef1e4b53948dbdb32af6431dfd05ec06b571ee52",
  user_role: "user",
  rpm_limit_per_model: {},
  tpm_limit_per_model: {},
  user_tpm_limit: 1000,
  user_rpm_limit: 100,
  user_email: "user@example.com",
  user: {
    user_email: "user@example.com",
    user_id: "user-1",
    user_alias: null,
  },
};

const mockTeam: Team = {
  team_id: "team-1",
  team_alias: "Test Team",
  models: ["gpt-3.5-turbo", "gpt-4"],
  max_budget: 500,
  budget_duration: "1m",
  tpm_limit: 5000,
  rpm_limit: 500,
  organization_id: "org-1",
  created_at: "2024-10-01T10:00:00Z",
  keys: [],
  members_with_roles: [],
  spend: 0,
};

const mockUseKeys = useKeys as MockedFunction<typeof useKeys>;
const mockUseTeams = useTeams as MockedFunction<typeof useTeams>;
const mockUseKeyInfo = useKeyInfo as MockedFunction<typeof useKeyInfo>;

const keyInfoResult = (data: KeyResponse | undefined, isError = false) =>
  ({ data, isError }) as ReturnType<typeof useKeyInfo>;

const keysResult = (keys: KeyResponse[], data: Partial<KeysResponse> = {}, extra: Record<string, unknown> = {}) =>
  ({
    data: {
      keys,
      total_count: keys.length,
      current_page: 1,
      total_pages: 1,
      ...data,
    } as KeysResponse,
    isPending: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...extra,
  }) as any;

const openFilters = () => fireEvent.click(screen.getByRole("button", { name: "Filters" }));

const lastSearchParam = (onUrlUpdate: Mock<OnUrlUpdateFunction>, name: string) =>
  onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get(name);

const lastKeyParam = (onUrlUpdate: Mock<OnUrlUpdateFunction>) => lastSearchParam(onUrlUpdate, "key");

const lastHistoryMode = (onUrlUpdate: Mock<OnUrlUpdateFunction>) => onUrlUpdate.mock.calls.at(-1)?.[0].options.history;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  mockUseKeys.mockReturnValue(keysResult([mockKey]));
  mockUseKeyInfo.mockReturnValue(keyInfoResult(undefined));

  mockUseTeams.mockReturnValue({
    teams: [mockTeam],
  });
});

describe("VirtualKeysTable", () => {
  // ... rest of tests will follow
  it("should render VirtualKeysTable component", () => {
    renderWithProviders(<VirtualKeysTable />);
    expect(screen.getByText("Virtual Keys")).toBeInTheDocument();
  });
});